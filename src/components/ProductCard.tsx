import React, { useEffect, useState } from 'react';
import { Heart, Package, ShoppingBag, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Product, ProductColorVariant } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, color?: ProductColorVariant) => void;
  onSelect: (product: Product) => void;
  staggerIndex?: number;
}

export const ProductImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  filterStyle?: string;
}> = ({ src, alt, className = '', filterStyle }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-emerald-50 text-slate-400 ${className}`}
      >
        <Package className="h-8 w-8 text-emerald-700/40" />
        <span className="mt-2 px-3 text-center text-xs font-medium text-slate-500 line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={filterStyle ? { filter: filterStyle } : undefined}
      className={`object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
      loading="lazy"
    />
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onSelect,
  staggerIndex = 0,
}) => {
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [userPickedColor, setUserPickedColor] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setActiveColorIdx(0);
    setUserPickedColor(false);
  }, [product.id]);

  const activeColor = product.colors[activeColorIdx] || product.colors[0];
  const hoverAltImage =
    !userPickedColor && isHovered && product.images.length > 1
      ? product.images[1]
      : null;

  const displayImage = hoverAltImage || activeColor?.image || product.images[0];
  const displayFilter = hoverAltImage ? undefined : activeColor?.imageFilter;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.36,
        delay: Math.min((staggerIndex % 6) * 0.045, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-[0_14px_30px_-10px_rgba(14,159,110,0.22)]"
    >
      {/* Uniform Product Image Area with Pop-Forward Zoom & Smooth Swatch Transition */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F4F6]">
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="relative block h-full w-full text-left focus-visible:outline-none"
          aria-label={`View ${product.title}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${displayImage}-${displayFilter || 'base'}`}
              initial={{ opacity: 0.55, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.55, scale: 1.03 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
            >
              <ProductImage
                src={displayImage}
                alt={product.title}
                filterStyle={displayFilter}
                className="h-full w-full group-hover:scale-[1.09]"
              />
            </motion.div>
          </AnimatePresence>

          {/* Subtle glossy sheen sweep on hover */}
          <span
            aria-hidden="true"
            className="animate-sheen pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </button>

        {/* Markaz-style Top-Left Discount / Stock Tag */}
        {!product.inStock ? (
          <span className="pointer-events-none absolute top-2 left-2 rounded bg-slate-900/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
            Out of stock
          </span>
        ) : product.stockCount <= 15 ? (
          <span className="pointer-events-none absolute top-2 left-2 rounded bg-[#DC2626] px-2 py-0.5 text-[11px] font-bold text-white tabular-nums shadow-xs">
            Only {product.stockCount} left
          </span>
        ) : product.discountPercent ? (
          <span className="pointer-events-none absolute top-2 left-2 rounded bg-[#DC2626] px-2 py-0.5 text-[11px] font-bold text-white tabular-nums shadow-xs">
            -{product.discountPercent}%
          </span>
        ) : null}

        {/* Top-Right Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border shadow-xs transition-all duration-200 hover:scale-110 ${
            isWishlisted
              ? 'border-rose-200 bg-rose-50 text-rose-600'
              : 'border-slate-200/80 bg-white/95 text-slate-500 hover:text-rose-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick Add */}
        {product.inStock && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product, activeColor);
            }}
            className="absolute right-2 bottom-2 flex items-center gap-1 rounded-lg bg-[#0E9F6E] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 translate-y-1 shadow-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#057A55]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-3">
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="text-left text-[13px] font-medium leading-snug text-slate-800 line-clamp-2 hover:text-[#0E9F6E]"
        >
          {product.title}
        </button>

        {/* Interactive Color Dots that change card image */}
        {product.colors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={`Preview color ${c.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveColorIdx(idx);
                  setUserPickedColor(true);
                }}
                className={`h-3.5 w-3.5 rounded-full border transition-transform ${
                  activeColorIdx === idx
                    ? 'scale-110 ring-2 ring-[#0E9F6E] ring-offset-1 border-white'
                    : 'border-slate-300 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        <div className="mt-auto pt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono-num text-[15px] font-bold text-slate-900 tabular-nums">
              PKR {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="font-mono-num text-[11px] text-slate-400 line-through tabular-nums">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
            <span className="inline-flex items-center gap-1 font-medium text-slate-600">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
            <span>
              {product.soldCount >= 1000
                ? `${(product.soldCount / 1000).toFixed(1)}k sold`
                : `${product.soldCount} sold`}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
