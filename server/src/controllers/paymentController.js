import Stripe from "stripe";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      buyer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Order has already been paid.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      customer_email: req.user.email,

      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",

          product_data: {
            name: item.name,
          },

          unit_amount: Math.round(Number(item.price) * 100),
        },

        quantity: item.quantity,
      })),

      success_url:
        `${process.env.CLIENT_URL}/payment/success` +
        "?session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        `${process.env.CLIENT_URL}/payment/cancel`,

      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.stripeSessionId = session.id;

    await order.save();

    return res.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return res.status(500).json({
      message: "Unable to create Stripe checkout session.",
      error: error.message,
    });
  }
}

export async function stripeWebhook(req, res) {
  let event;

  try {
    const signature = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe webhook verification failed:", error.message);

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return res.status(400).json({
          message: "Order ID missing from Stripe metadata.",
        });
      }

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found.",
        });
      }

      // Prevent duplicate webhook processing.
      if (order.paymentStatus === "paid") {
        return res.json({
          received: true,
          message: "Payment was already processed.",
        });
      }

      // Decrease product stock after successful payment.
      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (!product) {
          console.warn(
            `Product ${item.product} no longer exists.`
          );
          continue;
        }

        product.stock = Math.max(
          0,
          product.stock - item.quantity
        );

        await product.save();
      }

      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paidAt = new Date();

      await order.save();

      console.log(
        `Payment confirmed for order ${order._id}`
      );
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return res.status(500).json({
      message: "Webhook processing failed.",
    });
  }
}