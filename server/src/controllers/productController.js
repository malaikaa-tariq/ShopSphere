import Product from "../models/Product.js";
import Order from "../models/Order.js";

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listProducts(req, res) {
  try {
    const products = await Product.find({
      status: "active",
      stock: { $gte: 0 },
    })
      .populate("seller", "name")
      .sort({ createdAt: -1 });

    return res.json({ products });
  } catch {
    return res.status(500).json({
      message: "Unable to load products.",
    });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate("seller", "name");

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json({ product });
  } catch {
    return res.status(400).json({
      message: "Invalid product ID.",
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
      !name ||
      !description ||
      !category ||
      price === undefined
    ) {
      return res.status(400).json({
        message:
          "Name, description, category and price are required.",
      });
    }

    const product = await Product.create({
      seller: req.user._id,
      name: name.trim(),
      slug: `${slugify(name)}-${Date.now()}`,
      description: description.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock || 0),
      images,
      status,
    });

    return res.status(201).json({
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create product.",
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      !product.seller.equals(req.user._id)
    ) {
      return res.status(403).json({
        message: "You do not own this product.",
      });
    }

    const allowed = [
      "name",
      "description",
      "category",
      "price",
      "stock",
      "images",
      "status",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    return res.json({ product });
  } catch {
    return res.status(500).json({
      message: "Unable to update product.",
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      !product.seller.equals(req.user._id)
    ) {
      return res.status(403).json({
        message: "You do not own this product.",
      });
    }

    product.status = "archived";
    await product.save();

    return res.json({
      message: "Product archived.",
    });
  } catch {
    return res.status(500).json({
      message: "Unable to archive product.",
    });
  }
}

export async function addReview(req, res) {
  try {
    const {
      rating,
      comment,
    } = req.body;

    const numericRating = Number(rating);

    if (
      numericRating < 1 ||
      numericRating > 5 ||
      !comment?.trim()
    ) {
      return res.status(400).json({
        message:
          "Rating must be 1-5 and comment is required.",
      });
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const deliveredOrder =
      await Order.findOne({
        buyer: req.user._id,
        orderStatus: "delivered",
        "items.product": product._id,
      });

    if (!deliveredOrder) {
      return res.status(403).json({
        message:
          "You can review this product only after delivery.",
      });
    }

    const alreadyReviewed = product.reviews.some(
      (review) =>
        review.user.equals(req.user._id)
    );

    if (alreadyReviewed) {
      return res.status(409).json({
        message:
          "You have already reviewed this product.",
      });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: numericRating,
      comment: comment.trim(),
    });

    product.numReviews =
      product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      ) / product.numReviews;

    await product.save();

    return res.status(201).json({
      message: "Review added successfully.",
      product,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to add review.",
    });
  }
}