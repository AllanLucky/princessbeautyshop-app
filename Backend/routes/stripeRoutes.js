import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, name, email, cart } = req.body;

    // Create Stripe customer
    const customer = await stripe.customers.create({
      metadata: { userId, name, email, cart: JSON.stringify(cart) },
    });

    // Map cart products to Stripe line_items
    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "KES",
        product_data: {
          name: product.title,
          images: product.img ? [String(product.img)] : [],
          description: product.desc || "",
          metadata: { id: product._id },
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity || 1,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: error.message });
  }
});

// WEBHOOK
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Webhook verified:", event.type);
    } catch (err) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Parse cart from metadata
        const cart = JSON.parse(session.metadata.cart);

        const newOrder = new Order({
          userId: session.metadata.userId,
          name: session.metadata.name,
          email: session.metadata.email,
          products: cart.products,
          total: cart.total,
          paymentIntentId: session.payment_intent,
          stripeSessionId: session.id,
          paymentStatus: "paid",
        });

        await newOrder.save();
        console.log("Order saved to MongoDB:", newOrder._id);
      } catch (err) {
        console.error("Error saving order:", err.message);
      }
    }

    res.json({ received: true });
  }
);

export default router;

