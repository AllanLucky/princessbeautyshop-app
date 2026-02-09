import express from "express";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoutes.js";
import bannerRoute from "./routes/bannerRoutes.js";
import usersRoute from "./routes/userRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import stripeRoute from "./routes/stripeRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// 🔥 IMPORTANT FOR PRODUCTION (render, nginx, VPS)
app.set("trust proxy", 1);

// ================= MIDDLEWARE =================

// Parse JSON
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// 🛡 GLOBAL RATE LIMITER (apply to all requests)
app.use(globalLimiter);

// ================= CORS =================
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS blocked: ${origin}`), false);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// ================= ROUTES =================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/banners", bannerRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/stripe", stripeRoute);
app.use("/api/v1/revenue", revenueRoutes);
app.use("/api/v1/invoices", invoiceRoutes);

// ================= ERRORS =================
app.use(notFound);
app.use(errorHandler);

export default app;