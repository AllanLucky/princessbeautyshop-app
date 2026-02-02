import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, email, name, cart } = req.body;

    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
        name,
        cart: JSON.stringify(cart.products),
        total: cart.total
      }
    });

    const line_items = cart.products.map((product) => ({
      price_data: {
        currency: "KES",
        product_data: {
          name: product.title,
          images: [product.img],
          description: product.desc,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
