import Product from "../models/Product.js";

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function listProducts(req, res) {
  const { q, category, seller } = req.query;
  const filter = { status: "active" };
  if (q) filter.$or = [{ name: new RegExp(q, "i") }, { description: new RegExp(q, "i") }];
  if (category) filter.category = category;
  if (seller) filter.seller = seller;
  const products = await Product.find(filter).populate("seller", "name");
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id).populate("seller", "name");
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export async function createProduct(req, res) {
  const product = await Product.create({ ...req.body, seller: req.user._id, slug: `${slugify(req.body.name)}-${Date.now()}` });
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (req.user.role !== "admin" && !product.seller.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (req.user.role !== "admin" && !product.seller.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });
  await product.deleteOne();
  res.json({ message: "Product deleted" });
}

export async function addReview(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const already = product.reviews.some((r) => r.user.equals(req.user._id));
  if (already) return res.status(409).json({ message: "You already reviewed this product" });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: req.body.rating, comment: req.body.comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.numReviews;
  await product.save();
  res.status(201).json(product);
}
