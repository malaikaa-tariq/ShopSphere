import Product from "../models/Product.js";
import Order from "../models/Order.js";

export async function createOrder(req, res) {
  const { items, shippingAddress } = req.body;
  if (!items?.length) return res.status(400).json({ message: "Cart is empty" });

  const normalized = [];
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.status !== "active") return res.status(400).json({ message: "Product unavailable" });
    if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

    normalized.push({
      product: product._id,
      seller: product.seller,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      quantity: item.quantity
    });
    total += product.price * item.quantity;
  }

  const order = await Order.create({ buyer: req.user._id, items: normalized, shippingAddress, total });
  res.status(201).json(order);
}

export async function myOrders(req, res) {
  res.json(await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 }));
}

export async function sellerOrders(req, res) {
  const orders = await Order.find({ "items.seller": req.user._id }).populate("buyer", "name email").sort({ createdAt: -1 });
  res.json(orders);
}

export async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.orderStatus = req.body.status;
  await order.save();
  res.json(order);
}
