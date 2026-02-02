import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, name, email, cart } = req.body;
    if (!cart.products || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "KES",
        product_data: {
          name: product.title,
          images: product.img ? [String(product.img)] : [],
          description: product.desc || "",
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId,
        name,
        email,
        total: cart.total,
        products: JSON.stringify(cart.products.map((p) => ({ id: p._id, quantity: p.quantity })))
      }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ error: error.message });
  }
});

// STRIPE WEBHOOK
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
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { userId, name, email, products: productsMetaStr, total } = session.metadata;
        const productsMeta = JSON.parse(productsMetaStr);
        const productIds = productsMeta.map((p) => p.id);
        const products = await Product.find({ _id: { $in: productIds } });

        const newOrder = new Order({
          userId,
          name,
          email,
          products: products.map((p) => {
            const meta = productsMeta.find((m) => m.id === String(p._id));
            return {
              _id: p._id,
              title: p.title,
              desc: p.desc,
              price: p.price,
              quantity: meta ? meta.quantity : 1,
              img: p.img
            };
          }),
          total,
          paymentIntentId: session.payment_intent,
          stripeSessionId: session.id,
          paymentMethod: "Stripe",
          paymentStatus: "PAID"
        });

        await newOrder.save();
        console.log("✅ Order saved via Stripe webhook:", newOrder._id);
      }
    } catch (err) {
      console.error("Webhook order save failed:", err.message);
    }

    res.json({ received: true });
  }
);

export default router;
