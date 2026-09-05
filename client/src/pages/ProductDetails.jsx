import { useEffect, useState } from "react";
import { Star, ShoppingBag } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data.product || data);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Product not found."
        );
      });
  }, [id]);

  if (error) {
    return (
      <div className="page container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page container">
        Loading product...
      </div>
    );
  }

  const image =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

  return (
    <div className="page">
      <div className="container product-detail">
        <div className="detail-image">
          <img src={image} alt={product.name} />
        </div>

        <div className="detail-content">
          <span className="eyebrow">
            {product.category}
          </span>

          <h1 className="page-title">
            {product.name}
          </h1>

          <div className="rating">
            <Star size={16} fill="currentColor" />
            {Number(product.rating || 0).toFixed(1)}
            <small>
              ({product.numReviews || 0} reviews)
            </small>
          </div>

          <h2 className="detail-price">
            ${Number(product.price).toFixed(2)}
          </h2>

          <p>{product.description}</p>

          <p className="stock">
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>

          <button
            className="button"
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
          >
            <ShoppingBag size={18} />
            Add to cart
          </button>

          <div className="review-list">
            <h2>Customer reviews</h2>

            {product.reviews?.length ? (
              product.reviews.map((review) => (
                <div
                  className="review"
                  key={review._id}
                >
                  <strong>{review.name}</strong>

                  <div className="rating">
                    {"★".repeat(review.rating)}
                  </div>

                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}