import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      <div>
        <div className="relative overflow-hidden aspect-square bg-slate-100 rounded-none">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 text-white rounded-none shadow-sm"
            style={{ backgroundColor: '#889FD1' }}
          >
            {product.category}
          </span>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold text-slate-900 text-base line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <span className="text-lg font-extrabold text-slate-900">${product.price}</span>
        <button
          onClick={() => onAddToCart(product)}
          className="px-4 py-2 text-white text-xs font-bold rounded-none transition-all active:scale-95 shadow-sm hover:opacity-90"
          style={{ backgroundColor: '#889FD1' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;