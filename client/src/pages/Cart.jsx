import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "../features/cart/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();

  const items = useSelector(
    (state) => state.cart.items
  );

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  if (!items.length) {
    return (
      <div className="page">
        <div className="container empty">
          <h1 className="page-title">
            Your cart is empty
          </h1>

          <p>Add something beautiful to your cart.</p>

          <Link className="button" to="/products">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">Shopping cart</span>

        <h1 className="page-title">
          Your selected products
        </h1>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div
                className="cart-item"
                key={item.product}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <h3>{item.name}</h3>

                  <strong>
                    ${Number(item.price).toFixed(2)}
                  </strong>

                  <div className="quantity">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product,
                            quantity:
                              item.quantity - 1,
                          })
                        )
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product,
                            quantity:
                              item.quantity + 1,
                          })
                        )
                      }
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <button
                  className="delete-button"
                  onClick={() =>
                    dispatch(
                      removeFromCart(item.product)
                    )
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          <aside className="summary-card">
            <span className="eyebrow">Summary</span>

            <h2>
              ${total.toFixed(2)}
            </h2>

            <p>
              Taxes and shipping are calculated during
              checkout.
            </p>

            <Link
              className="button"
              style={{ width: "100%" }}
              to="/checkout"
            >
              Continue to checkout
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}