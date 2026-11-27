import React from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem } from '../types';
import { ProductImage } from './ProductCard';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  onBrowseCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  onBrowseCatalog,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.price + (item.isResell ? item.resellerProfit : 0)) * item.quantity,
    0
  );
  const totalResellerProfit = items.reduce(
    (sum, item) => sum + (item.isResell ? item.resellerProfit * item.quantity : 0),
    0
  );
  const deliveryFee = items.length === 0 || subtotal >= 3000 ? 0 : 125;
  const totalPayable = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]">
      <div
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-label="Your shopping bag"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#0E9F6E]" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Your bag
            </h2>
            <span className="font-mono-num text-xs font-semibold text-slate-500 tabular-nums">
              ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
              Your bag is empty
            </h3>
            <p className="mt-1.5 max-w-xs text-sm text-slate-500">
              Add products as you browse — they&apos;ll show up here ready for checkout.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBrowseCatalog();
              }}
              className="mt-6 rounded-xl bg-[#0E9F6E] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#057A55]"
            >
              Browse Markaz
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5 py-2">
              {items.map((item) => {
                const unitPrice =
                  item.product.price + (item.isResell ? item.resellerProfit : 0);
                return (
                  <div key={item.cartItemId} className="flex gap-3.5 py-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      <ProductImage
                        src={item.selectedColorImage || item.product.images[0]}
                        alt={item.product.title}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                          {item.product.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          aria-label="Remove item"
                          className="shrink-0 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.selectedColor} · {item.selectedSize}
                      </p>

                      {item.isResell && (
                        <p className="mt-1 text-xs font-semibold text-[#0E9F6E] tabular-nums">
                          Resell order · Profit +PKR{' '}
                          {(item.resellerProfit * item.quantity).toLocaleString()}
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="font-mono-num text-sm font-bold text-slate-900 tabular-nums">
                          PKR {(unitPrice * item.quantity).toLocaleString()}
                        </span>

                        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-[#F7F8FA]">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartItemId, -1)}
                            aria-label="Decrease quantity"
                            className="flex h-7 w-7 items-center justify-center text-slate-600 hover:text-slate-900"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono-num w-7 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartItemId, 1)}
                            aria-label="Increase quantity"
                            className="flex h-7 w-7 items-center justify-center text-slate-600 hover:text-slate-900"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary */}
            <div className="border-t border-slate-200 bg-[#F7F8FA] p-5">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono-num font-semibold text-slate-900 tabular-nums">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery fee</span>
                  <span className="font-mono-num font-semibold text-slate-900 tabular-nums">
                    {deliveryFee === 0 ? 'Free' : `PKR ${deliveryFee}`}
                  </span>
                </div>
                {totalResellerProfit > 0 && (
                  <div className="flex items-center justify-between text-[#0E9F6E]">
                    <span className="font-medium">Your reseller profit</span>
                    <span className="font-mono-num font-bold tabular-nums">
                      +PKR {totalResellerProfit.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-slate-900">
                  <span>Total payable</span>
                  <span className="font-mono-num tabular-nums">
                    PKR {totalPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              {subtotal < 3000 && (
                <p className="mt-2 text-[11px] text-slate-500 tabular-nums">
                  Add PKR {(3000 - subtotal).toLocaleString()} more for free nationwide delivery.
                </p>
              )}

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#0E9F6E] text-sm font-semibold text-white transition-colors hover:bg-[#057A55]"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
