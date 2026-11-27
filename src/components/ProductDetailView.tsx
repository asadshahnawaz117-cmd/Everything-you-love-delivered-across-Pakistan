import React, { useEffect, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  TrendingUp,
  Truck,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCTS } from '../data/catalog';
import { AppView, Product, ProductColorVariant } from '../types';
import { ProductCard, ProductImage } from './ProductCard';

interface ProductDetailViewProps {
  product: Product;
  isWishlisted: boolean;
  wishlistIds: string[];
  onNavigate: (view: AppView) => void;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (opts: {
    product: Product;
    quantity: number;
    color: string;
    colorImage: string;
    size: string;
    isResell: boolean;
    resellerProfit: number;
  }) => void;
  onBuyNow: (opts: {
    product: Product;
    quantity: number;
    color: string;
    colorImage: string;
    size: string;
    isResell: boolean;
    resellerProfit: number;
  }) => void;
  onQuickAdd: (product: Product, color?: ProductColorVariant) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  isWishlisted,
  wishlistIds,
  onNavigate,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onQuickAdd,
  onSelectProduct,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [galleryOverrideIdx, setGalleryOverrideIdx] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isResell, setIsResell] = useState(false);
  const [resellerProfit, setResellerProfit] = useState(350);
  const [followingShop, setFollowingShop] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setSelectedColorIdx(0);
    setGalleryOverrideIdx(null);
    setSelectedSize(product.sizes[0] || 'Standard');
    setQuantity(1);
    setIsResell(false);
    setResellerProfit(350);
    setAddedFeedback(false);
    setActiveTab('overview');
    setZoomOpen(false);
  }, [product]);

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];

  // Combine product images + color images cleanly
  const gallerySlides = product.images.length > 0 ? product.images : [activeColor.image];

  const mainImageSrc =
    galleryOverrideIdx !== null
      ? gallerySlides[galleryOverrideIdx] || activeColor.image
      : activeColor?.image || gallerySlides[0];

  const mainImageFilter =
    galleryOverrideIdx !== null ? undefined : activeColor?.imageFilter;

  const handleSelectColor = (idx: number) => {
    setSelectedColorIdx(idx);
    setGalleryOverrideIdx(null); // immediately show the selected color's image!
  };

  const handleSelectThumbnail = (idx: number) => {
    setGalleryOverrideIdx(idx);
  };

  const similarProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const fallbackSimilar =
    similarProducts.length >= 4
      ? similarProducts
      : [
          ...similarProducts,
          ...PRODUCTS.filter(
            (p) => p.id !== product.id && !similarProducts.some((sp) => sp.id === p.id)
          ),
        ].slice(0, 4);

  const handleCopyShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAdd = () => {
    onAddToCart({
      product,
      quantity,
      color: activeColor?.name || 'Standard',
      colorImage: mainImageSrc,
      size: selectedSize,
      isResell,
      resellerProfit: isResell ? resellerProfit : 0,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleBuy = () => {
    onBuyNow({
      product,
      quantity,
      color: activeColor?.name || 'Standard',
      colorImage: mainImageSrc,
      size: selectedSize,
      isResell,
      resellerProfit: isResell ? resellerProfit : 0,
    });
  };

  const unitFinalPrice = product.price + (isResell ? resellerProfit : 0);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 pb-24 lg:px-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={() => onNavigate({ type: 'home' })}
          className="hover:text-[#0E9F6E]"
        >
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() => onNavigate({ type: 'shop', origin: product.origin })}
          className="hover:text-[#0E9F6E]"
        >
          {product.origin === 'china' ? 'China' : 'Shop'}
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() => onNavigate({ type: 'category', slug: product.category })}
          className="hover:text-[#0E9F6E]"
        >
          {product.categoryLabel}
        </button>
        <span aria-hidden="true">/</span>
        <span className="max-w-xs truncate font-medium text-slate-900">
          {product.title}
        </span>
      </nav>

      {/* Main 3-Column PDP Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: Sticky Image Gallery with Carousel Arrows */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Thumbnails */}
            <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
              {gallerySlides.map((img, idx) => {
                const isActive =
                  galleryOverrideIdx === idx ||
                  (galleryOverrideIdx === null && mainImageSrc === img);
                return (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => handleSelectThumbnail(idx)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-100 transition-colors ${
                      isActive
                        ? 'border-[#0E9F6E]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <ProductImage
                      src={img}
                      alt={`${product.title} view ${idx + 1}`}
                      className="h-full w-full"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Photo Frame with Smooth Transition & Click-to-Zoom */}
            <div className="group relative order-1 aspect-[4/3] flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:order-2">
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label="Enlarge product image"
                className="block h-full w-full cursor-zoom-in focus-visible:outline-none"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${mainImageSrc}-${mainImageFilter || 'base'}`}
                    initial={{ opacity: 0.45, scale: 0.95, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0.45, scale: 1.03, x: -10 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full"
                  >
                    <ProductImage
                      src={mainImageSrc}
                      alt={`${product.title} — ${activeColor?.name}`}
                      filterStyle={mainImageFilter}
                      className="h-full w-full group-hover:scale-[1.04]"
                    />
                  </motion.div>
                </AnimatePresence>
              </button>

              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label="Zoom image"
                className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition-transform hover:scale-110 hover:bg-white"
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              {/* Slide arrows */}
              {gallerySlides.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      handleSelectThumbnail(
                        galleryOverrideIdx === null
                          ? gallerySlides.length - 1
                          : (galleryOverrideIdx - 1 + gallerySlides.length) %
                              gallerySlides.length
                      )
                    }
                    className="absolute top-1/2 left-2.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() =>
                      handleSelectThumbnail(
                        galleryOverrideIdx === null
                          ? 1 % gallerySlides.length
                          : (galleryOverrideIdx + 1) % gallerySlides.length
                      )
                    }
                    className="absolute top-1/2 right-2.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Active Color Caption */}
              <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
                {activeColor?.name}
              </span>
            </div>
          </div>

          {/* Share & Save Row */}
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              className="inline-flex items-center gap-1.5 hover:text-rose-600"
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              <span>{isWishlisted ? 'Saved to favorites' : 'Save'}</span>
              <span className="font-mono-num text-slate-400 tabular-nums">
                ({product.likesCount + (isWishlisted ? 1 : 0)})
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopyShare}
              className="inline-flex items-center gap-1.5 hover:text-[#0E9F6E]"
            >
              {copiedLink ? (
                <>
                  <Check className="h-4 w-4 text-[#0E9F6E]" />
                  <span className="text-[#0E9F6E]">Link copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center: Contiguous Purchase Module */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-[#0E9F6E]">
              Markaz verified seller
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">{product.sku}</span>
          </div>

          <h1 className="mt-2 font-display text-xl font-bold leading-snug text-slate-900">
            {product.title}
          </h1>

          {/* Rating & Stock */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-900 tabular-nums">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className="underline decoration-slate-300 underline-offset-4 hover:text-[#0E9F6E] tabular-nums"
            >
              {product.reviewCount} reviews
            </button>
            <span>·</span>
            <span className="tabular-nums">{product.soldCount.toLocaleString()} sold</span>
          </div>

          {/* Price Box */}
          <div className="mt-4 border-y border-slate-100 py-3.5">
            <div className="flex items-baseline gap-3">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900 tabular-nums">
                PKR {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="font-mono-num text-sm text-slate-400 line-through tabular-nums">
                  PKR {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {product.origin === 'china'
                ? `PKR ${(product.price + product.deliveryFee).toLocaleString()} to your door · incl. PKR ${product.deliveryFee} delivery`
                : 'Cash on delivery available nationwide'}
            </p>
            <p
              className={`mt-2 text-xs font-semibold ${
                product.inStock ? 'text-[#0E9F6E]' : 'text-rose-600'
              }`}
            >
              {product.inStock
                ? `${product.stockCount >= 1000 ? '1,000+' : product.stockCount} in stock`
                : 'Out of stock'}
            </p>
          </div>

          {/* COLOR IMAGE SWATCH SELECTOR (Matches frames 01:41 & 03:50!) */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Color</span>
              <span className="font-medium text-slate-600">{activeColor?.name}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c, idx) => {
                const active = selectedColorIdx === idx;
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => handleSelectColor(idx)}
                    className={`group relative flex flex-col items-center rounded-lg border-2 p-1 transition-all ${
                      active
                        ? 'border-[#0E9F6E] bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="h-11 w-11 overflow-hidden rounded-md bg-slate-100">
                      <ProductImage
                        src={c.image}
                        alt={c.name}
                        filterStyle={c.imageFilter}
                        className="h-full w-full"
                      />
                    </div>
                    <span
                      className="mt-1 h-2 w-6 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size / Option Selector */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Size / Capacity</span>
              <span className="text-slate-500">{selectedSize}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((sz) => {
                const active = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-[#0E9F6E] bg-emerald-50 text-[#057A55]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Quantity</span>
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-[#F7F8FA]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono-num w-9 text-center text-sm font-bold text-slate-900 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Resell & Earn Margin Mode */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-[#F7F8FA] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#0E9F6E]" />
                <span className="text-xs font-bold text-slate-900">
                  Resell &amp; Earn Margin
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsResell(!isResell)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  isResell
                    ? 'bg-[#0E9F6E] text-white'
                    : 'border border-slate-300 bg-white text-slate-700'
                }`}
              >
                {isResell ? 'Active' : 'Enable'}
              </button>
            </div>

            {isResell && (
              <div className="mt-3 space-y-2 border-t border-slate-200 pt-2.5">
                <div className="flex items-center gap-2">
                  {[250, 400, 600].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setResellerProfit(preset)}
                      className={`rounded-md border px-2 py-1 text-xs font-semibold tabular-nums ${
                        resellerProfit === preset
                          ? 'border-[#0E9F6E] bg-emerald-50 text-[#057A55]'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      +{preset}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={resellerProfit}
                    onChange={(e) =>
                      setResellerProfit(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="font-mono-num h-7 w-20 rounded-md border border-slate-300 bg-white px-2 text-xs font-bold text-slate-900 tabular-nums"
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Customer pays:</span>
                  <span className="font-mono-num font-bold text-slate-900 tabular-nums">
                    PKR {(unitFinalPrice * quantity).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#0E9F6E] font-semibold">
                  <span>Your profit:</span>
                  <span className="font-mono-num tabular-nums">
                    +PKR {(resellerProfit * quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTAs: Add to bag + Buy now */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleAdd}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-900 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-40"
            >
              {addedFeedback ? (
                <>
                  <Check className="h-4 w-4 text-[#0E9F6E]" />
                  <span className="text-[#0E9F6E]">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to bag</span>
                </>
              )}
            </button>
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleBuy}
              className="flex h-11 items-center justify-center rounded-xl bg-[#0E9F6E] px-4 text-sm font-semibold text-white hover:bg-[#057A55] disabled:opacity-40"
            >
              Buy now
            </button>
          </div>
        </div>

        {/* Right: Delivery, Returns & Verified Supplier Card */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Delivery &amp; Protection
            </h2>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#0E9F6E]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Delivery in {product.deliveryDays}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {product.courierName} ·{' '}
                    {product.deliveryFee === 0
                      ? 'Free shipping'
                      : `Flat PKR ${product.deliveryFee}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-[#0E9F6E]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Return allowed within 7 days
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Easy replacement or refund via Markaz.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0E9F6E]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {product.origin === 'china'
                      ? 'Customs Handled'
                      : 'Cash on Delivery'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {product.origin === 'china'
                      ? 'No hidden customs duties on delivery.'
                      : 'Pay cash at your doorstep across Pakistan.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#0E9F6E]">
                <Store className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {product.supplierName}
                </p>
                <p className="text-xs text-slate-500">
                  {product.supplierCity} · {product.supplierFollowers.toLocaleString()} followers
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFollowingShop(!followingShop)}
                className={`h-9 rounded-lg border text-xs font-semibold transition-colors ${
                  followingShop
                    ? 'border-[#0E9F6E] bg-emerald-50 text-[#057A55]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {followingShop ? 'Following' : 'Follow shop'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'category', slug: product.category })}
                className="h-9 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Visit shop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Overview & Reviews */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-6 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'border-[#0E9F6E] text-[#057A55]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Product overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'reviews'
                ? 'border-[#0E9F6E] text-[#057A55]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Ratings &amp; reviews ({product.reviews.length})
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-4 rounded-xl bg-[#F7F8FA] p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Material
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {product.highlights.material}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Pattern / Style
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {product.highlights.pattern}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Package Includes
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {product.highlights.packageIncludes}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Source
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {product.highlights.originLabel}
                </p>
              </div>
            </div>

            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
              {product.overview.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {product.reviews.length === 0 ? (
              <p className="text-sm text-slate-500">
                Overall seller rating is {product.rating.toFixed(1)}/5.0 across{' '}
                {product.soldCount} orders.
              </p>
            ) : (
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-xl border border-slate-100 bg-[#F7F8FA] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {rev.author}
                    </span>
                    <span className="text-xs text-slate-400">{rev.date}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Similar Products */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Similar products
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'category', slug: product.category })}
            className="text-xs font-semibold text-[#0E9F6E] hover:underline"
          >
            View all in {product.categoryLabel}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {fallbackSimilar.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isWishlisted={wishlistIds.includes(item.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Sticky Bottom Buy Bar (Matches frames 03:13 & 07:09!) */}
      <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <ProductImage
                src={mainImageSrc}
                alt={product.title}
                filterStyle={mainImageFilter}
                className="h-full w-full"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900 sm:text-sm">
                {product.title}
              </p>
              <p className="font-mono-num text-xs font-bold text-[#0E9F6E] tabular-nums">
                PKR {product.price.toLocaleString()} · {activeColor?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleAdd}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap"
            >
              Add to bag
            </button>
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleBuy}
              className="h-9 rounded-lg bg-[#0E9F6E] px-4 text-xs font-semibold text-white hover:bg-[#057A55] whitespace-nowrap"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Stylish Lightbox Zoom Modal */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
            role="dialog"
            aria-label="Zoomed product photo"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="Close zoomed image"
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-50">
                <ProductImage
                  src={mainImageSrc}
                  alt={product.title}
                  filterStyle={mainImageFilter}
                  className="h-full w-full"
                />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-xs text-slate-700">
                <span className="font-semibold truncate">{product.title}</span>
                <span className="font-medium text-[#0E9F6E] shrink-0">
                  {activeColor?.name}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
