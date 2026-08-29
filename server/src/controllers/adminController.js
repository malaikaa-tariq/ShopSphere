import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export async function overview(req, res) {
  const [users, sellers, products, orders] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "seller" }),
    Product.countDocuments(),
    Order.countDocuments()
  ]);
  const revenue = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  res.json({ users, sellers, products, orders, revenue: revenue[0]?.total || 0 });
}
