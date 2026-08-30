import Product from "../models/Product.js";
import Order from "../models/Order.js";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function listProducts(req, res) {
  try {
    const { q, category, seller, includeArchived } = req.query;

    const filter =
      includeArchived === "true"
        ? {}
        : { status: "active" };

    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (seller) {
      filter.seller = seller;
    }

    const products = await Product.find(filter)
      .populate("seller", "name")
      .sort({ createdAt: -1 });

    return res.json(products);
  } catch (error) {
    console.error("listProducts:", error);
    return res.status(500).json({
      message: "Failed to fetch products.",
    });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name");

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json(product);
  } catch (error) {
    console.error("getProduct:", error);
    return res.status(500).json({
      message: "Failed to fetch product.",
    });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      category,
      price,
      stock,
      images = [],
      status = "active",
    } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      Number(price) < 0 ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        message: "Complete product fields.",
      });
    }

    const product = await Product.create({
      seller: req.user._id,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock),
      images: Array.isArray(images) ? images : [],
      status,
      slug: `${slugify(name)}-${Date.now()}`,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("createProduct:", error);

    return res.status(500).json({
      message: "Failed to create product.",
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = product.seller.equals(req.user._id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Forbidden.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "category",
      "price",
      "stock",
      "images",
      "status",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    }

    await product.save();

    return res.json(product);
  } catch (error) {
    console.error("updateProduct:", error);

    return res.status(500).json({
      message: "Failed to update product.",
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = product.seller.equals(req.user._id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Forbidden.",
      });
    }

    await product.deleteOne();

    return res.json({
      message: "Product deleted.",
    });
  } catch (error) {
    console.error("deleteProduct:", error);

    return res.status(500).json({
      message: "Failed to delete product.",
    });
  }
}

export async function addReview(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const delivered = await Order.exists({
      buyer: req.user._id,
      paymentStatus: "paid",
      orderStatus: "delivered",
      "items.product": product._id,
    });

    if (!delivered) {
      return res.status(403).json({
        message: "Review available after delivery.",
      });
    }

    const alreadyReviewed = product.reviews.some((review) =>
      review.user.equals(req.user._id)
    );

    if (alreadyReviewed) {
      return res.status(409).json({
        message: "Already reviewed.",
      });
    }

    const rating = Number(req.body.rating);
    const comment = req.body.comment?.trim();

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      !comment
    ) {
      return res.status(400).json({
        message: "Rating and comment are required.",
      });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });

    product.numReviews = product.reviews.length;

    product.rating = Number(
      (
        product.reviews.reduce(
          (total, review) => total + review.rating,
          0
        ) / product.numReviews
      ).toFixed(1)
    );

    await product.save();

    return res.status(201).json(product);
  } catch (error) {
    console.error("addReview:", error);

    return res.status(500).json({
      message: "Failed to add review.",
    });
  }
}