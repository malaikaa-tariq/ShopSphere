import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function createOrder(req, res) {
  try {
    const {
      items,
      shippingAddress,
    } = req.body;

    if (
      !Array.isArray(items) ||
      !items.length
    ) {
      return res.status(400).json({
        message: "Cart cannot be empty.",
      });
    }

    const products = await Product.find({
      _id: {
        $in: items.map(
          (item) => item.product
        ),
      },
      status: "active",
    });

    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = productMap.get(
        String(item.product)
      );

      if (!product) {
        return res.status(400).json({
          message:
            "One or more products are unavailable.",
        });
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          message: "Invalid quantity.",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message:
            `${product.name} does not have enough stock.`,
        });
      }

      orderItems.push({
        product: product._id,
        seller: product.seller,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity,
      });

      total += product.price * quantity;
    }

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      shippingAddress,
      total,
    });

    return res.status(201).json({
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create order.",
    });
  }
}

export async function myOrders(req, res) {
  const orders = await Order.find({
    buyer: req.user._id,
  }).sort({ createdAt: -1 });

  return res.json({ orders });
}

export async function getMyOrder(req, res) {
  const order = await Order.findOne({
    _id: req.params.id,
    buyer: req.user._id,
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found.",
    });
  }

  return res.json({ order });
}

export async function sellerOrders(req, res) {
  const orders = await Order.find({
    "items.seller": req.user._id,
  })
    .populate("buyer", "name email")
    .sort({ createdAt: -1 });

  return res.json({ orders });
}

export async function allOrders(req, res) {
  const orders = await Order.find()
    .populate("buyer", "name email")
    .sort({ createdAt: -1 });

  return res.json({ orders });
}

export async function updateOrderStatus(
  req,
  res
) {
  const { status } = req.body;

  const allowed = [
    "processing",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status.",
    });
  }

  const order = await Order.findById(
    req.params.id
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found.",
    });
  }

  if (req.user.role === "seller") {
    const ownsItem = order.items.some(
      (item) =>
        item.seller.equals(req.user._id)
    );

    if (!ownsItem) {
      return res.status(403).json({
        message:
          "This order does not belong to your products.",
      });
    }
  }

  order.orderStatus = status;

  if (status === "delivered") {
    order.deliveredAt = new Date();
  }

  if (status === "cancelled") {
    order.cancelledAt = new Date();
  }

  await order.save();

  return res.json({ order });
}