import mongoose from "mongoose";
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
    const { userId, name, email, cart, total } = req.body;

    if (!cart?.products || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // ✅ Validate userId (optional)
    let validUserId = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      validUserId = new mongoose.Types.ObjectId(userId);
    }

    // ✅ Save pending order
    const pendingOrder = await Order.create({
      userId: validUserId, // null if guest
      name,
      email,
      products: cart.products.map((p) => ({
        productId: p._id, // string is fine even if product deleted later
        title: p.title,
        desc: p.desc,
        price: p.price,
        quantity: p.quantity,
        img: Array.isArray(p.img) ? p.img[0] : p.img || "",
      })),
      total,
      paymentStatus: "pending",
    });

    // ✅ Prepare Stripe line items
    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "KES",
        product_data: {
          name: product.title,
          images: product.img ? [String(product.img)] : [],
          description: product.desc || "",
        },
        unit_amount: Math.round(product.price * 100), // Stripe expects cents
      },
      quantity: product.quantity || 1,
    }));

    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${pendingOrder._id}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        orderId: pendingOrder._id.toString(),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe checkout error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================= STRIPE WEBHOOK =================
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("🔥 Event received:", event.type);
    } catch (err) {
      console.error("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { orderId } = session.metadata;

        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
          console.error("❌ Invalid or missing orderId in metadata");
          return res.status(400).send("Invalid orderId in metadata");
        }

        const order = await Order.findById(orderId);
        if (!order) {
          console.error("❌ Order not found:", orderId);
          return res.status(404).send("Order not found");
        }

        order.paymentStatus = "paid";
        order.paymentIntentId = session.payment_intent;
        order.stripeSessionId = session.id;
        await order.save();

        console.log("✅ Order updated successfully via webhook:", order._id);
      }
    } catch (err) {
      console.error("❌ Order save/update failed:", err);
    }

    res.json({ received: true });
  }
);

// ================= FETCH ORDER BY STRIPE SESSION =================
router.get("/orders/stripe/:sessionId", async (req, res) => {
  try {
    const order = await Order.findOne({
      stripeSessionId: req.params.sessionId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;