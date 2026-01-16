import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

// -------------------------
// CREATE CHECKOUT SESSION
// -------------------------
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, name, email, cart } = req.body;

    if (!cart.products || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Map cart products to Stripe line items
    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "KES",
        product_data: {
          name: product.title,
          images: product.img ? [String(product.img)] : [],
          description: product.desc || "",
          metadata: { id: product._id },
        },
        unit_amount: Math.round(product.price * 100), // Stripe expects cents
      },
      quantity: product.quantity || 1,
    }));

    // Create checkout session with metadata
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.CLIENT_URL}/myorders?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/cart?canceled=true`,
      metadata: {
        userId,
        name,
        email,
        total: cart.total,
        products: JSON.stringify(
          cart.products.map((p) => ({ id: p._id, quantity: p.quantity }))
        ),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------
// STRIPE WEBHOOK
// -------------------------
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        // ✅ Successful checkout
        case "checkout.session.completed": {
          const session = event.data.object;
          const { userId, name, email, products: productsMetaStr, total } =
            session.metadata;

          const productsMeta = JSON.parse(productsMetaStr);
          const productIds = productsMeta.map((p) => p.id);
          const products = await Product.find({ _id: { $in: productIds } });

          const newOrder = new Order({
            userId,
            name,
            email,
            products: products.map((p) => {
              const meta = productsMeta.find((mp) => mp.id === String(p._id));
              return {
                _id: p._id,
                title: p.title,
                desc: p.desc,
                price: p.price,
                quantity: meta ? meta.quantity : 1,
                img: p.img,
              };
            }),
            total,
            paymentIntentId: session.payment_intent,
            stripeSessionId: session.id,
            paymentMethod: "Stripe",
            paymentStatus: "PAID",
          });

          await newOrder.save();
          console.log("✅ Order saved successfully:", newOrder._id);
          break;
        }

        // ✅ Refunds
        case "charge.refunded": {
          const charge = event.data.object;
          await Order.findOneAndUpdate(
            { paymentIntentId: charge.payment_intent },
            { paymentStatus: "REFUNDED", refundedDate: new Date() }
          );
          console.log("✅ Order marked as refunded:", charge.payment_intent);
          break;
        }

        // ✅ Declines
        case "payment_intent.payment_failed": {
          const intent = event.data.object;
          await Order.findOneAndUpdate(
            { paymentIntentId: intent.id },
            {
              paymentStatus: "DECLINED",
              declineReason: intent.last_payment_error?.message,
            }
          );
          console.log("❌ Payment failed:", intent.id);
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("❌ Error handling webhook:", err.message);
    }

    res.json({ received: true });
  }
);

export default router;
