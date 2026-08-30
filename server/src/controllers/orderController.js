import Product from "../models/Product.js";
import Order from "../models/Order.js";

const statuses = [
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const allowedTransitions = {
  processing: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export async function createOrder(req, res) {
  try {
    const { items, shippingAddress } = req.body;

    if (!items?.length) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    const requiredAddressFields = [
      "fullName",
      "address",
      "city",
      "country",
      "postalCode",
    ];

    if (
      !shippingAddress ||
      requiredAddressFields.some(
        (field) => !String(shippingAddress[field] || "").trim()
      )
    ) {
      return res.status(400).json({
        message: "Complete your shipping address.",
      });
    }

    let total = 0;
    const normalizedItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: "Invalid quantity.",
        });
      }

      const product = await Product.findById(item.product);

      if (!product || product.status !== "active") {
        return res.status(400).json({
          message: "A product is unavailable.",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} left for ${product.name}.`,
        });
      }

      normalizedItems.push({
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
      items: normalizedItems,
      shippingAddress,
      total: Number(total.toFixed(2)),
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("createOrder:", error);

    return res.status(500).json({
      message: "Failed to create order.",
    });
  }
}

export async function myOrders(req, res) {
  try {
    const orders = await Order.find({
      buyer: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (error) {
    console.error("myOrders:", error);

    return res.status(500).json({
      message: "Failed to fetch orders.",
    });
  }
}

export async function getMyOrder(req, res) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    return res.json(order);
  } catch (error) {
    console.error("getMyOrder:", error);

    return res.status(500).json({
      message: "Failed to fetch order.",
    });
  }
}

export async function sellerOrders(req, res) {
  try {
    const orders = await Order.find({
      "items.seller": req.user._id,
    })
      .populate("buyer", "name email")
      .sort({
        createdAt: -1,
      });

    return res.json(orders);
  } catch (error) {
    console.error("sellerOrders:", error);

    return res.status(500).json({
      message: "Failed to fetch seller orders.",
    });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;

    if (!statuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const isAdmin = req.user.role === "admin";

    const isSeller =
      req.user.role === "seller" &&
      order.items.some((item) =>
        item.seller.equals(req.user._id)
      );

    if (!isAdmin && !isSeller) {
      return res.status(403).json({
        message: "Forbidden.",
      });
    }

    if (
      order.paymentStatus !== "paid" &&
      status !== "cancelled"
    ) {
      return res.status(400).json({
        message: "Only paid orders can be fulfilled.",
      });
    }

    const currentStatus = order.orderStatus || "processing";

    if (
      currentStatus !== status &&
      !allowedTransitions[currentStatus]?.includes(status)
    ) {
      return res.status(400).json({
        message: `Cannot move order from ${currentStatus} to ${status}.`,
      });
    }

    order.orderStatus = status;

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    if (status === "cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();

    return res.json(order);
  } catch (error) {
    console.error("updateOrderStatus:", error);

    return res.status(500).json({
      message: "Failed to update order status.",
    });
  }
}