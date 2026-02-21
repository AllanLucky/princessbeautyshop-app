import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

/*
=====================================================
HELPER FUNCTIONS
=====================================================
*/

// Normalize image array safely
const normalizeImages = (img) => {
  if (!img) return [];

  if (Array.isArray(img)) return img;

  if (typeof img === "object") {
    return Object.values(img).filter(Boolean);
  }

  return [img];
};

// =====================================================
// CREATE CHECKOUT SESSION
// =====================================================

router.post("/create-checkout-session", async (req, res) => {
  try {
    const {
      userId,
      email,
      name,
      phone,
      address,
      cart,
      total,
    } = req.body;

    if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
      return res.status(400).json({
        error: "Cart is empty",
      });
    }

    /*
    -----------------------------------------------------
    CREATE STRIPE CUSTOMER
    -----------------------------------------------------
    */

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: userId?.toString() || "",
        phone: phone || "",
        address: address || "",
      },
    });

    /*
    -----------------------------------------------------
    LINE ITEMS
    -----------------------------------------------------
    */

    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "KES",

        product_data: {
          name: product.title || "Product",
          images: normalizeImages(product.img),

          description: product.desc || "",
          metadata: {
            productId: product._id?.toString() || "",
          },
        },

        unit_amount: Math.round(
          Number(product.price || 0) * 100
        ),
      },

      quantity: Number(product.quantity || 1),
    }));

    /*
    -----------------------------------------------------
    CREATE SESSION
    -----------------------------------------------------
    */

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,

      payment_method_types: ["card"],

      line_items,

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,

      metadata: {
        userId: userId?.toString() || "",
        email: email || "",
        name: name || "",
      },
    });

    /*
    -----------------------------------------------------
    SAVE PENDING ORDER
    -----------------------------------------------------
    */

    const newOrder = await Order.create({
      userId,
      name,
      email,
      phone,
      address,
      products: cart.products,
      total: Number(total || 0),
      stripeSessionId: session.id,
      paymentStatus: "pending",
    });

    return res.status(200).json({
      url: session.url,
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error("Stripe error:", error.message);

    return res.status(500).json({
      error: "Payment session creation failed",
    });
  }
});

/*
=====================================================
WEBHOOK
=====================================================
*/

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
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    /*
    -----------------------------------------------------
    PAYMENT SUCCESS
    -----------------------------------------------------
    */

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        await Order.findOneAndUpdate(
          { stripeSessionId: session.id },
          {
            paymentStatus: "paid",
            paidAt: new Date(),
          },
          { new: true }
        );

        console.log("✅ Payment confirmed:", session.id);

      } catch (err) {
        console.error("Order update error:", err.message);
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;