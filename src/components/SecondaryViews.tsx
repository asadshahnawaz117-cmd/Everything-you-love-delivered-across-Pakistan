import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Package,
  Phone,
  ShieldCheck,
  TrendingUp,
  Truck,
  X,
} from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { AppView, Order, Product, ProductColorVariant, UserProfile } from '../types';
import { ProductCard, ProductImage } from './ProductCard';

/* ================= WISHLIST VIEW ================= */
export const WishlistView: React.FC<{
  wishlistIds: string[];
  onNavigate: (view: AppView) => void;
  onToggleWishlist: (id: string) => void;
  onQuickAdd: (product: Product, color?: ProductColorVariant) => void;
  onSelectProduct: (product: Product) => void;
}> = ({
  wishlistIds,
  onNavigate,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
}) => {
  const savedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          My favorites
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Things you have saved for later. Tap the heart again to remove an item.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-lg font-bold text-slate-900">
            No favorites yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Tap the heart on any product to save it here — no sign-in needed.
          </p>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="mt-6 rounded-xl bg-[#059669] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#047857]"
          >
            Browse products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {savedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= ORDERS VIEW ================= */
export const OrdersView: React.FC<{
  orders: Order[];
  onNavigate: (view: AppView) => void;
}> = ({ orders, onNavigate }) => {
  const totalEarned = orders.reduce((s, o) => s + o.totalResellerProfit, 0);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            My Orders & Tracking
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track Cash on Delivery shipments and reseller profit earnings across Pakistan.
          </p>
        </div>
        {totalEarned > 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm">
            <span className="text-slate-600">Total Reseller Profit: </span>
            <span className="font-mono-num font-bold text-emerald-800 tabular-nums">
              +PKR {totalEarned.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Package className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-lg font-bold text-slate-900">
            No orders placed yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Explore wholesale-friendly products across Pakistan or China and place your first COD order.
          </p>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="mt-6 rounded-xl bg-[#059669] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#047857]"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-mono-num font-bold text-slate-900">
                    Order #{order.id}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">{order.createdAt}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-600">{order.paymentMethod}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <Truck className="h-4 w-4" />
                  {order.status}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        <ProductImage
                          src={item.selectedColorImage || item.product.images[0]}
                          alt={item.product.title}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {item.product.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.selectedColor} · {item.selectedSize} · Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-num text-sm font-bold text-slate-900 tabular-nums shrink-0">
                      PKR{' '}
                      {(
                        (item.product.price +
                          (item.isResell ? item.resellerProfit : 0)) *
                        item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <span>
                  Deliver to: <strong className="text-slate-900">{order.customerName}</strong> ({order.city})
                </span>
                <div className="flex items-center gap-4">
                  {order.totalResellerProfit > 0 && (
                    <span className="font-mono-num font-bold text-emerald-700 tabular-nums">
                      Profit: +PKR {order.totalResellerProfit.toLocaleString()}
                    </span>
                  )}
                  <span className="font-mono-num text-sm font-bold text-slate-900 tabular-nums">
                    Total: PKR {order.totalCustomerPayable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= RESELL & DROPSHIP VIEW ================= */
export const ResellView: React.FC<{
  onNavigate: (view: AppView) => void;
}> = ({ onNavigate }) => {
  const [monthlyOrders, setMonthlyOrders] = useState(35);
  const [avgMargin, setAvgMargin] = useState(450);

  const estimatedMonthlyEarnings = monthlyOrders * avgMargin;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl bg-[#0D3B2E] p-8 text-white lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
            Markaz Reselling & Dropshipping Portal
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Start your online business with zero investment
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-emerald-100/90 sm:text-base">
            Pick winning products from verified suppliers across Pakistan or factory-direct from China. Add your own PKR margin, share to WhatsApp or Shopify, and receive payouts directly into Easypaisa, JazzCash, or your bank account.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-xs font-semibold text-emerald-300">01. Pick Products</p>
              <p className="mt-1 text-xs text-emerald-50">
                Choose from 100,000+ wholesale-priced items in fashion, tech & home.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-xs font-semibold text-emerald-300">02. Set Margin</p>
              <p className="mt-1 text-xs text-emerald-50">
                Add your custom profit in PKR on every order — no caps.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-xs font-semibold text-emerald-300">03. We Deliver</p>
              <p className="mt-1 text-xs text-emerald-50">
                Markaz delivers COD nationwide and transfers your profit automatically.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-50"
            >
              <span>Browse products to resell</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
              className="rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore China factory catalog
            </button>
          </div>
        </div>

        {/* Interactive Profit Calculator */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-5">
          <div className="flex items-center gap-2 text-emerald-700">
            <TrendingUp className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Reseller Income Estimator
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Adjust your monthly order volume and average profit margin per item.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Orders delivered per month</span>
                <span className="font-mono-num text-slate-900 tabular-nums">
                  {monthlyOrders} orders
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                className="mt-2 w-full accent-[#059669]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Average profit per order</span>
                <span className="font-mono-num text-slate-900 tabular-nums">
                  PKR {avgMargin}
                </span>
              </div>
              <input
                type="range"
                min={150}
                max={1500}
                step={50}
                value={avgMargin}
                onChange={(e) => setAvgMargin(Number(e.target.value))}
                className="mt-2 w-full accent-[#059669]"
              />
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Estimated Monthly Profit
              </p>
              <p className="mt-1 font-mono-num text-3xl font-extrabold text-slate-900 tabular-nums">
                PKR {estimatedMonthlyEarnings.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Zero inventory cost · Direct Easypaisa / Bank payout
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Export catalog CSV for Shopify & WooCommerce stores supported.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= LOGIN MODAL ================= */
export const LoginModal: React.FC<{
  isOpen: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
  onLogout: () => void;
}> = ({ isOpen, user, onClose, onLogin, onLogout }) => {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Islamabad');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: name.trim() || 'Markaz Shopper',
      phone: phone.trim() || '0300-1234567',
      email: 'shopper@markaz.app',
      city,
      isReseller: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-label="Markaz Sign In"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <span className="font-display text-lg font-bold text-slate-900">
            {user ? 'My Markaz Account' : 'Shop, share & grow with Markaz'}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {user ? (
          <div className="p-6 space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="font-display text-base font-bold text-slate-900">
                {user.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                {user.phone} · {user.city} · Active Reseller Account
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="h-10 w-full rounded-xl border border-rose-200 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-slate-600">
              Sign in with your Pakistani phone number to sync orders, favorites, and reseller profits.
            </p>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Phone number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="h-10 w-full rounded-lg border border-slate-300 pr-3 pl-9 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-emerald-600 focus:outline-none"
              >
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
              </select>
            </div>

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#0B1F3A] text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Continue with phone number
            </button>

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span>Cash on delivery · Resell to earn · Delivery handled</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
