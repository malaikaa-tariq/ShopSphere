import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import {
  stripeWebhook,
} from "./controllers/paymentController.js";

const app = express();

const allowedOrigins =
  (
    process.env.CLIENT_URL ||
    "http://localhost:5173"
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/*
 * Stripe webhook MUST receive the raw request body.
 * This route therefore comes before express.json().
 */
app.post(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  }),
  stripeWebhook
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(morgan("dev"));

app.get(
  "/api/health",
  (_req, res) =>
    res.json({
      ok: true,
      service: "shopsphere-api",
      timestamp:
        new Date().toISOString(),
    })
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use((_req, res) =>
  res.status(404).json({
    message: "Route not found.",
  })
);

app.use(
  (
    err,
    _req,
    res,
    _next
  ) => {
    console.error(err);

    return res.status(
      err.status || 500
    ).json({
      message:
        err.message ||
        "Server error.",
    });
  }
);

const port = Number(
  process.env.PORT || 5000
);

connectDB()
  .then(() => {
    app.listen(
      port,
      () =>
        console.log(
          `ShopSphere API listening on port ${port}`
        )
    );
  })
  .catch((error) => {
    console.error(
      "Startup failed:",
      error
    );

    process.exit(1);
  });