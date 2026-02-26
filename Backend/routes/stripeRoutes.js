import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

/*
=====================================================
HELPER
=====================================================
*/

const normalizeImages = (img) => {
  if (!img) return [];

  if (Array.isArray(img)) return img.slice(0, 1);

  if (typeof img === "object") {
    return Object.values(img).filter(Boolean).slice(0, 1);
  }

  return [img];
};

/*
=====================================================
CREATE CHECKOUT SESSION
=====================================================
*/

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, email, name, phone, address, cart, total } =
      req.body;

    if (!cart?.products?.length) {
      return res.status(400).json({
        error: "Cart is empty",
      });
    }

    /*
    Create Stripe customer
    */

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: String(userId || ""),
        phone: phone || "",
        address: address || "",
      },
    });

    /*
    Line items
    */

    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "KES",

        product_data: {
          name: product.title || "Product",
          images: normalizeImages(product.img),
          description: product.desc || "",
        },

        unit_amount: Math.round(
          Number(product.price || 0) * 100
        ),
      },

      quantity: Math.max(1, Number(product.quantity || 1)),
    }));

    /*
    Session URL
    */

    const frontendUrl = process.env.CLIENT_BASE_URL;

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,

      payment_method_types: ["card"],

      line_items,
      mode: "payment",

      metadata: {
        userId: String(userId || ""),
        email: email || "",
        name: name || "",
        phone: phone || "",
        address: address || "",
        total: String(total || 0),
      },

      success_url:
        `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${frontendUrl}/cart`,
    });

    /*
    Create pending order (important for verification lookup)
    */

    await Order.create({
      userId,
      name,
      email,
      phone,
      address,

      products: cart.products.map((p) => ({
        productId: p._id,
        title: p.title,
        desc: p.desc || "",
        price: Number(p.price || 0),
        quantity: Number(p.quantity || 1),
        img: Array.isArray(p.img) ? p.img[0] : p.img || "",
      })),

      total: Number(total || 0),

      stripeSessionId: session.id,

      paymentStatus: "pending",
      orderStatus: "processing",
    });

    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error("Stripe session error:", error.message);

    return res.status(500).json({
      error: "Payment session creation failed",
    });
  }
});

/*
=====================================================
ORDER VERIFICATION ENDPOINT ⭐ (PaymentSuccess Page)
=====================================================
*/

router.get("/verify/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const order = await Order.findOne({
      stripeSessionId: sessionId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);

  } catch (error) {
    console.error("Verification error:", error.message);

    res.status(500).json({
      message: "Server verification failed",
    });
  }
});

/*
=====================================================
WEBHOOK SOURCE OF TRUTH ⭐⭐⭐
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
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    /*
    PAYMENT SUCCESS
    */

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        await Order.findOneAndUpdate(
          {
            stripeSessionId: session.id,
            paymentStatus: "pending",
          },
          {
            paymentStatus: "paid",
            paidAt: new Date(),
          },
          { new: true }
        );

        console.log("✅ Payment confirmed:", session.id);

      } catch (err) {
        console.error("Webhook update error:", err.message);
      }
    }

    res.json({ received: true });
  }
);

export default router;