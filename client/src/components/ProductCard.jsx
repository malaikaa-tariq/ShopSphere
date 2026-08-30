import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-[4/3] bg-slate-100">
          {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">{product.category}</p>
        <h3 className="mt-1 line-clamp-1 font-bold">{product.name}</h3>
        <p className="mt-2 text-xl font-black">${product.price.toFixed(2)}</p>
        <button
          onClick={() => dispatch(addToCart({ product: product._id, name: product.name, price: product.price, image: product.images?.[0], quantity: 1 }))}
          className="mt-3 w-full rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
        >Add to cart</button>
      </div>
    </article>
  );
}
