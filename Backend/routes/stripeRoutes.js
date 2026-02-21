import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

// ================= CREATE CHECKOUT SESSION =================
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, email, name, cart } = req.body;

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    // Create line items
    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "KES",
        product_data: {
          name: product.title,
          images: [product.img],
          description: product.desc,
          metadata: { id: product._id },
        },
        unit_amount: product.price * 100, // convert to cents
      },
      quantity: product.quantity,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    // ✅ Save order BEFORE payment (pending)
    const newOrder = await Order.create({
      userId,
      name,
      email,
      products: cart.products,
      total: cart.total,
      stripeSessionId: session.id,
      paymentStatus: "pending",
    });

    res.status(200).json({
      url: session.url,
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


// ================= FETCH ORDER BY STRIPE SESSION =================
router.get("/orders/stripe/:sessionId", async (req, res) => {
  try {
    const order = await Order.findOne({
      stripeSessionId: req.params.sessionId,
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= STRIPE WEBHOOK =================
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Payment successful
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        await Order.findOneAndUpdate(
          { stripeSessionId: session.id },
          { paymentStatus: "paid" },
          { new: true }
        );

        console.log("✅ Payment successful for session:", session.id);
      } catch (err) {
        console.error("❌ Error updating order:", err.message);
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;