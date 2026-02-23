import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// ================= ERROR MIDDLEWARE =================
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

// ================= ROUTES =================
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoutes.js";
import bannerRoute from "./routes/bannerRoutes.js";
import usersRoute from "./routes/userRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import stripeRoute from "./routes/stripeRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import supportTicketRoutes from "./routes/supportTicketRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import clinicRoutes from "./routes/clinicRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import bundleRoutes from "./routes/bundleRoutes.js";

// ================= RATE LIMITER =================
import { globalLimiter } from "./middlewares/rateLimiter.js";

// ================= APP INITIALIZATION =================
const app = express();
app.set("trust proxy", 1);

// ================= PATH FIX =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CORS (PRODUCTION SAFE) =================

const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================= COOKIE PARSER =================
app.use(cookieParser());

// ================= RATE LIMITER =================
app.use(globalLimiter);

// ================= BODY PARSERS =================

// Skip JSON parsing for Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= STRIPE WEBHOOK (RAW BODY REQUIRED) =================

app.use(
  "/api/v1/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeRoute
);

// ================= API ROUTES =================

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/banners", bannerRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/stripe", stripeRoute);
app.use("/api/v1/revenue", revenueRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/returns", returnRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/tickets", supportTicketRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/clinic", clinicRoutes);
app.use("/api/v1/timetable", timetableRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/bundles", bundleRoutes);

// ================= ERROR HANDLING =================

app.use(notFound);
app.use(errorHandler);

export default app;