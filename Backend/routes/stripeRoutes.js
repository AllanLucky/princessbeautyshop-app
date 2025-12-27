import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js"
dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);
let cart;
let name;
let email;
let userId;

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId
    },
  });

  userId = req.body.userId;
  email = req.body.email;
  name = req.body.name;
  cart = req.body.cart;

  const line_items = req.body.cart.products.map((product) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          images: [product.img],
          description: product.desc,
          metadata: {
            id: product._id,
          },
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    };
  });
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(req.body.cart),
        email: req.body.email,
        name: req.body.name,
      },
    });

    res.send({ url: session.url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// web hook
let endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
// Example: STRIPE_WEBHOOK_SECRET=whsec_xxx in your .env

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          endpointSecret
        );
        console.log("webhook verified ");
        data = event.data.object;
        eventType = event.type;
      } catch (err) {
        console.log("webhook error", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      try {
        const customer = await stripe.customers.retrieve(data.customer);
        const cartData = JSON.parse(data.metadata.cart);

        const newOrder = Order({
          name: data.metadata.name,
          userId: data.metadata.userId,
          products: cartData.products,
          total: cartData.total,
          email: data.metadata.email,
        });
        await newOrder.save();
        console.log("Order saved:", newOrder._id);
      } catch (err) {
        console.log("Error saving order:", err.message);
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
  }
);

export default router;
