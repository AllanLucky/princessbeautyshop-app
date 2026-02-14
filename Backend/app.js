import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";

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

import { globalLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// 🔥 IMPORTANT FOR VPS/RENDER/NGINX
app.set("trust proxy", 1);

// ================= PATH FIX (IMPORTANT FOR PRODUCTION) =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MIDDLEWARE =================

// parse JSON requests
app.use(express.json());

// parse cookies
app.use(cookieParser());

// 🛡 Global rate limiter
app.use(globalLimiter);

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://your-production-frontend.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile apps or Postman

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS blocked: ${origin}`), false);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// ================= STATIC UPLOAD FOLDER =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// ================= NEW MODULE ROUTES =================
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/support-tickets", supportTicketRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/blogs", blogRoutes);

// ================= ERROR HANDLING =================
app.use(notFound);
app.use(errorHandler);

export default app;
