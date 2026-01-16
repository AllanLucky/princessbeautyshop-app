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

    // Create Stripe customer with metadata
    const customer = await stripe.customers.create({
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

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items,
      mode: "payment",
      payment_method_types: ["card"], // Optional: support only card for now
      success_url: `${process.env.CLIENT_URL}/myorders?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/cart?canceled=true`,
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

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        const { userId, name, email, products: productsMetaStr, total } =
          session.metadata;

        const productsMeta = JSON.parse(productsMetaStr);

        // Fetch actual products from DB
        const productIds = productsMeta.map((p) => p.id);
        const products = await Product.find({ _id: { $in: productIds } });

        // Build order
        const newOrder = new Order({
          userId,
          name,
          email,
          products: products.map((p) => {
            const meta = productsMeta.find(
              (mp) => mp.id === String(p._id)
            );
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
          paymentMethod: "Stripe", // Save the payment method
          paymentStatus: "PAID",
        });

        await newOrder.save();
        console.log("✅ Order saved successfully:", newOrder._id);
      } catch (err) {
        console.error("❌ Error saving order:", err.message);
      }
    }

    res.json({ received: true });
  }
);

export default router;
