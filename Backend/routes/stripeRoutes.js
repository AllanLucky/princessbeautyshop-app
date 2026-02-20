import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

<<<<<<< HEAD
// ================= CREATE CHECKOUT SESSION =================
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, name, email, cart } = req.body;

    const customer = await stripe.customers.create({
      metadata: { userId },
    });

    const line_items = cart.products.map((product) => ({
=======
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
>>>>>>> 62c12d2ea456a0b8487ebbc8182e35ed6b54d918
      price_data: {
        currency: "KES",
        product_data: {
          name: product.title,
          images: [product.img],
          description: product.desc,
          metadata: { id: product._id },
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));

<<<<<<< HEAD
=======
  try {
>>>>>>> 62c12d2ea456a0b8487ebbc8182e35ed6b54d918
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items,
      mode: "payment",
<<<<<<< HEAD
      success_url: `${process.env.CLIENT_URL}/customer-dashboard/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    // Save order with pending status
    const newOrder = new Order({
      name,
      email,
      userId,
      products: cart.products,
      total: cart.total,
      stripeSessionId: session.id,
      paymentStatus: "pending",
    });
    await newOrder.save();

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

=======
      success_url: `${process.env.CLIENT_URL}/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({ url: session.url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// // webhook
// let endpointSecret;

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   (req, res) => {
//     const sig = req.headers["stripe-signature"];

//     let data;
//     let eventType;

//     if (endpointSecret) {
//       let event;
//       try {
//         event = stripe.webhooks.constructEvent(
//           req.body,
//           sig,
//           endpointSecret
//         );
//         console.log("webhook verified ");
//       } catch (err) {
//         console.log("webhook error", err.message);
//         res.status(400).send(`Webhook Error: ${err.message}`);
//         return;
//       }

//       data = event.data.object;
//       eventType = event.type;
//     } else {
//       data = req.body.data.object;
//       eventType = req.body.type;
//     }

//     // Handle the event
//     if (eventType === "checkout.session.completed") {
//       if (data.customer) {
//         stripe.customers
//           .retrieve(data.customer)
//           .then(async (customer) => {
//             const newOrder = Order({
//               name,
//               userId,
//               products: cart.products,
//               total: cart.total,
//               email
//             });
//             await newOrder.save();
//           })
//           .catch((err) => {
//             console.log(err.message);
//           });
//       } else {
//         // fallback if no customer object
//         const newOrder = Order({
//           name,
//           userId,
//           products: cart.products,
//           total: cart.total,
//           email
//         });
//         newOrder.save().catch((err) => console.log(err.message));
//       }
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     res.send().end();
//   }
// );

>>>>>>> 62c12d2ea456a0b8487ebbc8182e35ed6b54d918
// ================= FETCH ORDER BY STRIPE SESSION =================
router.get("/orders/stripe/:sessionId", async (req, res) => {
  try {
    const order = await Order.findOne({ stripeSessionId: req.params.sessionId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= STRIPE WEBHOOK =================
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // Stripe requires raw body
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

    // Handle checkout session completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Update the order to mark as paid
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: session.id },
          { paymentStatus: "paid" },
          { new: true }
        );

        console.log("✅ Payment succeeded for order:", order?._id || "not found");
      } catch (err) {
        console.error("❌ Error updating order:", err.message);
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  }
);

export default router;