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
CHECKOUT SESSION
=====================================================
*/

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, email, name, phone, address, cart, total } =
      req.body;

    if (!cart?.products?.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    /*
    ⭐ Remove pending orders safely (avoid race bug)
    */

    await Order.deleteMany({
      userId,
      paymentStatus: "pending",
    });

    /*
    =====================================================
    CREATE CUSTOMER
    =====================================================
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
    =====================================================
    LINE ITEMS
    =====================================================
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
    =====================================================
    CREATE SESSION ⭐ CORE PART
    =====================================================
    */

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,

      payment_method_types: ["card"],

      line_items,

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/cart`,

      metadata: {
        userId: String(userId || ""),
        email: email || "",
        name: name || "",
      },
    });

    /*
    =====================================================
    SAVE PENDING ORDER
    =====================================================
    */

    const newOrder = await Order.create({
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
WEBHOOK (SOURCE OF TRUTH ⭐ VERY IMPORTANT)
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
    ⭐ Payment Success Event
    */

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        await Order.updateOne(
          { stripeSessionId: session.id },
          {
            paymentStatus: "paid",
            paidAt: new Date(),
            orderStatus: "processing",
          }
        );

        console.log("✅ Payment verified:", session.id);

      } catch (err) {
        console.error("Order update error:", err.message);
      }
    }

    res.json({ received: true });
  }
);

export default router;