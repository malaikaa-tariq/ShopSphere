import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export async function overview(
  _req,
  res
) {
  const [
    users,
    sellers,
    products,
    orders,
    paidOrders,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      role: "seller",
    }),

    Product.countDocuments(),

    Order.countDocuments(),

    Order.find({
      paymentStatus: "paid",
    }).select("total"),

    Order.find()
      .populate("buyer", "name email")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const revenue =
    paidOrders.reduce(
      (sum, order) =>
        sum + Number(order.total),
      0
    );

  return res.json({
    stats: {
      users,
      sellers,
      products,
      orders,
      revenue,
    },

    recentOrders,
  });
}

export async function listUsers(
  _req,
  res
) {
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });

  return res.json({ users });
}