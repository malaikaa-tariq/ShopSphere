const Cart = require('../models/Cart'); // Schema with user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

// Get User's Personal Cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve cart' });
  }
};

// Add Item to Personal Cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart' });
  }
};