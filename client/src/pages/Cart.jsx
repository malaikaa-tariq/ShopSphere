import React from 'react';

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">Your Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors font-bold text-lg"
            >
              ✕
            </button>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-slate-400 text-sm font-medium">Your cart is currently empty.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-center justify-between"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-xl bg-white border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-bold mt-1">${item.price}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-white border border-slate-200 text-xs font-bold flex items-center justify-center hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-white border border-slate-200 text-xs font-bold flex items-center justify-center hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-xs text-red-500 font-bold hover:text-red-700 p-2"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Summary and Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
              <div className="flex justify-between text-base font-extrabold text-slate-900">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <button
                className="w-full py-3.5 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 hover:opacity-90"
                style={{ backgroundColor: '#889FD1' }}
                onClick={() => alert("Proceeding to checkout...")}
              >
                Checkout Now
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Cart;