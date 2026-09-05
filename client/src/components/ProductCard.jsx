import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const image =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image">
        <img src={image} alt={product.name} />
      </Link>

      <div className="product-content">
        <span className="eyebrow">{product.category}</span>

        <Link to={`/products/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>

        <div className="rating">
          <Star size={15} fill="currentColor" />
          <span>{Number(product.rating || 0).toFixed(1)}</span>
          <small>({product.numReviews || 0})</small>
        </div>

        <div className="product-bottom">
          <strong>${Number(product.price).toFixed(2)}</strong>

          <button
            className="icon-button"
            disabled={!product.stock}
            onClick={() =>
              dispatch(
                addToCart({
                  product: product._id,
                  name: product.name,
                  price: product.price,
                  image,
                  stock: product.stock,
                })
              )
            }
            aria-label="Add to cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}