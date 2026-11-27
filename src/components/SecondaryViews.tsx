import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Heart,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Truck,
  X,
} from 'lucide-react';
import { PRODUCTS, SHOP_CATEGORY_TILES } from '../data/catalog';
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
  const recommendedProducts = PRODUCTS.filter((p) => !wishlistIds.includes(p.id)).slice(0, 18);
  const dealsProducts = PRODUCTS.filter((p) => (p.discountPercent || 0) >= 22).slice(0, 12);

  const exportWishlistCsv = () => {
    const itemsToExport = savedProducts.length > 0 ? savedProducts : PRODUCTS.slice(0, 12);
    const headers = ['SKU', 'Title', 'Category', 'Origin', 'Price_PKR', 'Image'];
    const rows = itemsToExport.map((p) =>
      [
        p.sku,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.categoryLabel}"`,
        p.origin,
        p.price,
        p.images[0] || '',
      ].join(',')
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'markaz-favorites.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            My favorites ({savedProducts.length})
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Things you have saved for later or to export to your Shopify/WooCommerce store.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {savedProducts.length > 0 && (
            <button
              type="button"
              onClick={() => savedProducts.forEach((p) => onQuickAdd(p))}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E9F6E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#057A55]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add all to bag
            </button>
          )}
          <button
            type="button"
            onClick={exportWishlistCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
          >
            <Download className="h-3.5 w-3.5" />
            Export Favorites CSV
          </button>
        </div>
      </div>

      {savedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="mt-3 font-display text-lg font-bold text-slate-900">
            No favorites yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Tap the heart on any product below to save it here — no sign-in needed.
          </p>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="mt-5 rounded-xl bg-[#059669] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#047857]"
          >
            Browse full shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {savedProducts.map((p, idx) => (
            <ProductCard
              key={p.id}
              product={p}
              staggerIndex={idx}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}

      {/* Recommended For You (18 products) */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Recommended to save &amp; resell
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="text-xs font-semibold text-[#0E9F6E] hover:underline"
          >
            Browse 260+ items →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {recommendedProducts.map((p, idx) => (
            <ProductCard
              key={`wl-rec-${p.id}`}
              product={p}
              staggerIndex={idx}
              isWishlisted={wishlistIds.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Best Deals Today (12 products) */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-900">
          Today&apos;s Best Deals
        </h2>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {dealsProducts.map((p, idx) => (
            <ProductCard
              key={`wl-deal-${p.id}`}
              product={p}
              staggerIndex={idx}
              isWishlisted={wishlistIds.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 18 Categories */}
      <section className="mt-12 border-t border-slate-200 pt-8">
        <h2 className="mb-4 font-display text-lg font-bold text-slate-900">
          Explore all 18 categories
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
          {SHOP_CATEGORY_TILES.map((tile) => (
            <button
              key={`wl-cat-${tile.label}`}
              type="button"
              onClick={() => onNavigate({ type: 'category', slug: tile.slug })}
              className="group flex flex-col items-center text-center"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-[#F4F5F7] p-1 transition-all group-hover:-translate-y-1 group-hover:border-[#0E9F6E]">
                <ProductImage
                  src={tile.image}
                  alt={tile.label}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <span className="mt-1 text-[11px] font-semibold text-slate-700 line-clamp-1 group-hover:text-[#0E9F6E]">
                {tile.label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ================= ORDERS VIEW ================= */
export const OrdersView: React.FC<{
  orders: Order[];
  wishlistIds?: string[];
  onNavigate: (view: AppView) => void;
  onToggleWishlist?: (id: string) => void;
  onQuickAdd?: (product: Product, color?: ProductColorVariant) => void;
  onSelectProduct?: (product: Product) => void;
}> = ({
  orders,
  wishlistIds = [],
  onNavigate,
  onToggleWishlist = () => {},
  onQuickAdd = () => {},
  onSelectProduct,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'Processing' | 'In Transit' | 'Delivered'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const totalEarned = orders.reduce((s, o) => s + o.totalResellerProfit, 0);

  const visibleOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status.toLowerCase().includes(statusFilter.toLowerCase()));

  const handleSelect = (p: Product) => {
    if (onSelectProduct) onSelectProduct(p);
    else onNavigate({ type: 'product', productId: p.id });
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            My Orders &amp; Tracking
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

      {/* Interactive Status Filter Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(['all', 'Processing', 'In Transit', 'Delivered'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === tab
                ? 'border-[#0E9F6E] bg-[#0E9F6E] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-[#0E9F6E]'
            }`}
          >
            {tab === 'all' ? `All Orders (${orders.length})` : tab}
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Package className="h-6 w-6" />
          </div>
          <h2 className="mt-3 font-display text-lg font-bold text-slate-900">
            {orders.length === 0 ? 'No orders placed yet' : `No ${statusFilter} orders`}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Explore wholesale-friendly products across Pakistan or China and place your first COD order.
          </p>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="mt-5 rounded-xl bg-[#059669] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#047857]"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
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
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <Truck className="h-4 w-4" />
                      {order.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
                    >
                      {isExpanded ? 'Hide Tracking' : 'Track Parcel'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Order Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-emerald-800">
                      <Truck className="h-4 w-4 shrink-0" />
                      <span>Dispatched ({order.city})</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Package className="h-4 w-4 shrink-0" />
                      <span>Cash on Delivery</span>
                    </div>
                  </div>
                )}

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
            );
          })}
        </div>
      )}

      {/* Bestsellers to Order Next (24 products + 18 categories) */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Bestsellers to order next
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="text-xs font-semibold text-[#0E9F6E] hover:underline"
          >
            Open Shop →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {PRODUCTS.slice(0, 24).map((p, idx) => (
            <ProductCard
              key={`ord-rec-${p.id}`}
              product={p}
              staggerIndex={idx}
              isWishlisted={wishlistIds.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-slate-200 pt-8">
        <h2 className="mb-4 font-display text-lg font-bold text-slate-900">
          Shop by category
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
          {SHOP_CATEGORY_TILES.map((tile) => (
            <button
              key={`ord-cat-${tile.label}`}
              type="button"
              onClick={() => onNavigate({ type: 'category', slug: tile.slug })}
              className="group flex flex-col items-center text-center"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-[#F4F5F7] p-1 transition-all group-hover:-translate-y-1 group-hover:border-[#0E9F6E]">
                <ProductImage
                  src={tile.image}
                  alt={tile.label}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <span className="mt-1 text-[11px] font-semibold text-slate-700 line-clamp-1 group-hover:text-[#0E9F6E]">
                {tile.label}
              </span>
            </button>
          ))}
        </div>
      </section>
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
