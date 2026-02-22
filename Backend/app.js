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

// ================= RATE LIMITER =================
import { globalLimiter } from "./middlewares/rateLimiter.js";

// ================= APP INITIALIZATION =================
const app = express();
app.set("trust proxy", 1); // for VPS / reverse proxy setups

// ================= PATH FIX =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://your-production-frontend.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS blocked: ${origin}`), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================= COOKIE PARSER =================
app.use(cookieParser());

// ================= RATE LIMITER =================
app.use(globalLimiter);

// ================= BODY PARSERS =================
// Regular JSON parser for all routes except Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/stripe/webhook") {
    next(); // skip for webhook
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= STRIPE WEBHOOK =================
// Must use raw body ONLY for Stripe webhook signature verification
import stripeRawMiddleware from "express"; // using express.raw() directly
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

// ================= EXTRA MODULES =================
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/tickets", supportTicketRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/blogs", blogRoutes);

// ================= ERROR HANDLING =================
app.use(notFound);
app.use(errorHandler);

export default app;