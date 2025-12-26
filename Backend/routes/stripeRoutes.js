import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

let cart;
let name;
let email;
let userId;

router.post("/create-checkout-session", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId || "guest",
      },
    });

    userId = req.body.userId;
    email = req.body.email;
    name = req.body.name;
    cart = req.body.cart;

    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "KES",
        product_data: {
          name: product.title || "Untitled",
          images: product.img ? [String(product.img)] : [], // ✅ ensure string array
          description: product.desc || "",
          metadata: {
            id: product._id || "",
          },
        },
        unit_amount: Math.round(Number(product.price) * 100),
      },
      quantity: product.quantity > 0 ? product.quantity : 1,
    }));

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).send({ error: error.message });
  }
});

export default router;
