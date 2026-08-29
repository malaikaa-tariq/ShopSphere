import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
  const { orderId } = req.body;
  const order = await Order.findOne({ _id: orderId, buyer: req.user._id }).populate("items.product");
  if (!order) return res.status(404).json({ message: "Order not found" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name, images: item.image ? [item.image] : [] },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    })),
    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    metadata: { orderId: order._id.toString() }
  });

  order.stripeSessionId = session.id;
  await order.save();
  res.json({ url: session.url, sessionId: session.id });
}

export async function stripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = Stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send("Webhook signature verification failed");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await Order.findOneAndUpdate(
      { _id: session.metadata.orderId },
      { paymentStatus: "paid", orderStatus: "confirmed" }
    );
  }
  res.json({ received: true });
}
