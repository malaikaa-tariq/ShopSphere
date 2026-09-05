import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || ""
);

export async function createCheckoutSession(
  req,
  res
) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        message:
          "Stripe is not configured on the server.",
      });
    }

    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      buyer: req.user._id,
      paymentStatus: "pending",
    });

    if (!order) {
      return res.status(404).json({
        message:
          "Pending order not found.",
      });
    }

    const lineItems =
      order.items.map((item) => ({
        price_data: {
          currency: "usd",

          product_data: {
            name: item.name,

            images: item.image
              ? [item.image]
              : undefined,
          },

          unit_amount: Math.round(
            Number(item.price) * 100
          ),
        },

        quantity: item.quantity,
      }));

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: lineItems,

        customer_email: req.user.email,

        metadata: {
          orderId: order._id.toString(),
        },

        success_url:
          `${process.env.CLIENT_URL}/payment-result`,

        cancel_url:
          `${process.env.CLIENT_URL}/payment-result?cancelled=true`,
      });

    order.stripeSessionId = session.id;

    await order.save();

    return res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Unable to create Stripe checkout session.",
    });
  }
}

export async function stripeWebhook(
  req,
  res
) {
  const signature =
    req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send(
      "Missing Stripe signature."
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).send(
      "Stripe webhook secret is not configured."
    );
  }

  let event;

  try {
    event =
      stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
  } catch (error) {
    console.error(
      "Webhook signature verification failed:",
      error.message
    );

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }

  if (
    event.type ===
    "checkout.session.completed"
  ) {
    const session = event.data.object;

    const orderId =
      session.metadata?.orderId;

    if (orderId) {
      const order =
        await Order.findById(orderId);

      if (
        order &&
        order.paymentStatus !== "paid"
      ) {
        for (const item of order.items) {
          const result =
            await Product.updateOne(
              {
                _id: item.product,
                stock: {
                  $gte: item.quantity,
                },
              },
              {
                $inc: {
                  stock: -item.quantity,
                },
              }
            );

          if (result.modifiedCount !== 1) {
            console.error(
              `Stock update failed for product ${item.product}`
            );
          }
        }

        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paidAt = new Date();

        await order.save();
      }
    }
  }

  return res.json({
    received: true,
  });
}