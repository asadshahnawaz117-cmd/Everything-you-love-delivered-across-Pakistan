import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Globe,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  CATEGORIES,
  FAQS,
  OCCASIONS,
  PRODUCTS,
} from '../data/catalog';
import { AppView, OccasionSlug, Product, ProductColorVariant } from '../types';
import { ProductCard, ProductImage } from './ProductCard';

interface HomeViewProps {
  lang: 'en' | 'ur';
  wishlistIds: string[];
  onNavigate: (view: AppView) => void;
  onSearchSubmit: (query: string) => void;
  onToggleWishlist: (id: string) => void;
  onQuickAdd: (product: Product, color?: ProductColorVariant) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lang,
  wishlistIds,
  onNavigate,
  onSearchSubmit,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionSlug>('eid-edit');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const primaryCategories = CATEGORIES.slice(0, 9);
  const visibleCategories = showAllCategories ? CATEGORIES : primaryCategories;

  const occasionProducts = PRODUCTS.filter((p) =>
    p.occasions.includes(selectedOccasion)
  ).slice(0, 6);

  const melaProducts = PRODUCTS.filter((p) => p.sponsored).slice(0, 6);
  const chinaProducts = PRODUCTS.filter((p) => p.origin === 'china').slice(0, 6);
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 6);
  const newTodayProducts = PRODUCTS.filter((p) => p.isNew).slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onSearchSubmit(heroSearch.trim());
    } else {
      onNavigate({ type: 'shop', origin: 'pakistan' });
    }
  };

  return (
    <div className="bg-white pb-12">
      {/* 1. EXACT MARKAZ.APP HERO (Royal Indigo-Purple to Ocean Teal-Emerald + Geometric Pattern) */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom_right,_#13795B_0%,_#0F4C5C_42%,_#181A63_78%,_#1B1352_100%)] text-white">
        {/* Subtle Interlocking-Circle Lattice Pattern */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="markaz-lattice"
              width="56"
              height="56"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1"
              />
              <circle
                cx="0"
                cy="0"
                r="22"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1"
              />
              <circle
                cx="56"
                cy="56"
                r="22"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#markaz-lattice)" />
        </svg>

        {/* Subtle Glowing Dots matching reference image */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute top-12 left-[42%] h-1.5 w-1.5 rounded-full bg-emerald-300/60 blur-[1px]" />
          <span className="absolute top-1/3 right-[44%] h-2 w-2 rounded-full bg-lime-300/50 blur-[1px]" />
          <span className="absolute bottom-14 left-[28%] h-1.5 w-1.5 rounded-full bg-emerald-300/60 blur-[1px]" />
          <span className="absolute bottom-20 right-[12%] h-2.5 w-2.5 rounded-full bg-lime-300/50 blur-[2px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-4 py-9 lg:px-6 lg:py-11">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left Focal Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/45 bg-[#0A2E2E]/70 px-3.5 py-1.5 text-xs font-medium text-emerald-100">
                <Sparkles className="h-3.5 w-3.5 text-[#84E14B]" />
                <span>
                  {lang === 'ur'
                    ? 'کیش آن ڈیلیوری · 7 دن میں واپسی · کم از کم آرڈر نہیں'
                    : 'Cash on delivery · 7-day returns · No minimum order'}
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-[46px]">
                {lang === 'ur'
                  ? 'آپ کی پسند کی ہر چیز، پورے پاکستان میں ڈیلیور'
                  : 'Everything you love, delivered across Pakistan'}
              </h1>

              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-slate-200/95 sm:text-[15px]">
                {lang === 'ur'
                  ? 'بہترین قیمتوں پر لاکھوں مصنوعات — قابلِ اعتماد مقامی دکانداروں اور براہِ راست چین فیکٹریوں سے۔'
                  : 'Millions of products at the best prices — from trusted local sellers and factory-direct from China.'}
              </p>

              {/* Pure White Pill Search Bar + Mint-Emerald Pill Button */}
              <form
                onSubmit={handleHeroSearch}
                className="mt-6 flex max-w-xl items-center rounded-full bg-white p-1.5 shadow-2xl"
              >
                <Search className="ml-3.5 h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder={
                    lang === 'ur'
                      ? 'مصنوعات، برانڈز اور کیٹیگریز تلاش کریں'
                      : 'Find products, brands & categories'
                  }
                  className="h-10 w-full bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-10 rounded-full bg-[#0FD18F] px-6 text-[13.5px] font-bold text-[#052E24] transition-colors hover:bg-[#0BB87D] whitespace-nowrap shrink-0"
                >
                  {lang === 'ur' ? 'تلاش' : 'Search'}
                </button>
              </form>

              {/* Trending Line */}
              <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-200">
                <span className="font-medium text-slate-300">Trending:</span>
                {['Lawn suits', 'Wireless earbuds', 'Watches'].map((term, idx) => (
                  <React.Fragment key={term}>
                    <button
                      type="button"
                      onClick={() => onSearchSubmit(term)}
                      className="underline decoration-white/45 underline-offset-4 hover:text-white"
                    >
                      {term}
                    </button>
                    {idx < 2 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
                  className="underline decoration-white/45 underline-offset-4 hover:text-white"
                >
                  Shop from China
                </button>
              </div>

              <p className="mt-5 text-xs text-slate-200/90">
                Want to earn from home?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'resell' })}
                  className="font-semibold text-white underline underline-offset-4 hover:text-[#84E14B]"
                >
                  Resell
                </button>{' '}
                or{' '}
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'resell' })}
                  className="font-semibold text-white underline underline-offset-4 hover:text-[#84E14B]"
                >
                  dropship
                </button>{' '}
                with Markaz — no investment needed.
              </p>
            </div>

            {/* Right Dual Frosted Glass Cards (Pakistan + China) */}
            <div className="flex flex-col gap-3.5 lg:col-span-5">
              {/* Shop from Pakistan Glass Card */}
              <div
                onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onNavigate({ type: 'shop', origin: 'pakistan' });
                  }
                }}
                className="group cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/15"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tracking-wide text-slate-200">
                      PK
                    </span>
                    <span className="text-xs font-medium text-slate-100">
                      Pakistan
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/75 transition-transform group-hover:translate-x-0.5" />
                </div>

                <h2 className="mt-2 font-display text-lg font-bold text-white">
                  Shop from Pakistan
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-200/90">
                  Trusted local sellers, delivered fast with cash on delivery.
                </p>

                <div className="mt-3.5 flex flex-wrap gap-2 text-[11px] text-white/95">
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                    150,000+ products
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                    Cash on delivery
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                    7-day returns
                  </span>
                </div>

                <div className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>Shop from Pakistan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Shop from China Glass Card */}
              <div
                onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onNavigate({ type: 'shop', origin: 'china' });
                  }
                }}
                className="group cursor-pointer rounded-2xl border border-white/20 bg-white/8 p-5 backdrop-blur-md transition-colors hover:bg-white/15"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tracking-wide text-slate-200">
                      CN
                    </span>
                    <span className="text-xs font-medium text-slate-100">
                      China
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/75 transition-transform group-hover:translate-x-0.5" />
                </div>

                <h2 className="mt-2 font-display text-lg font-bold text-white">
                  Shop from China
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-200/90">
                  Factory-direct prices, with freight and customs handled to your door.
                </p>

                <div className="mt-3.5 flex flex-wrap gap-2 text-[11px] text-white/95">
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                    Millions of products
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                    Customs handled
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                    ~10–17 days
                  </span>
                </div>

                <div className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>Explore China</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 Bordered White Trust Cards (Exact match to screenshot & video) */}
      <section className="bg-white pt-5">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:px-6">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-2xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0E9F6E]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Cash on delivery</p>
              <p className="text-xs text-slate-500">Pay when it arrives</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-2xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0E9F6E]">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Fast delivery</p>
              <p className="text-xs text-slate-500">3–5 days nationwide</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-2xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0E9F6E]">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">7-day returns</p>
              <p className="text-xs text-slate-500">Buyer protection</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-2xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0E9F6E]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Factory prices</p>
              <p className="text-xs text-slate-500">Direct from source</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category (9-circle primary row matching screenshot + expand to 14) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-9 lg:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
              Shop by category
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Discover millions of products across every category
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs font-semibold text-slate-600 hover:text-[#0E9F6E] whitespace-nowrap"
            >
              {showAllCategories ? 'Show top 9' : `All ${CATEGORIES.length} categories`}
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E9F6E] hover:underline whitespace-nowrap"
            >
              <span>See all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
          {visibleCategories.map((cat, idx) => (
            <motion.button
              key={cat.slug}
              type="button"
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.34,
                delay: Math.min(idx * 0.035, 0.28),
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => onNavigate({ type: 'category', slug: cat.slug })}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-2 aspect-square w-20 overflow-hidden rounded-full border border-slate-200/80 bg-[#F4F5F7] p-1 shadow-2xs transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-105 group-hover:border-[#0E9F6E] group-hover:shadow-[0_12px_24px_-8px_rgba(14,159,110,0.32)] sm:w-24">
                <ProductImage
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full rounded-full object-cover group-hover:scale-110"
                />
              </div>
              <span className="text-xs font-medium text-slate-800 line-clamp-2 transition-colors group-hover:text-[#0E9F6E]">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* 4. Shop by Occasion (6-column grid matching video) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-11 lg:px-6">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
              Shop by occasion
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {OCCASIONS.find((o) => o.slug === selectedOccasion)?.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {OCCASIONS.map((occ) => {
              const active = selectedOccasion === occ.slug;
              return (
                <button
                  key={occ.slug}
                  type="button"
                  onClick={() => setSelectedOccasion(occ.slug)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[#0E9F6E] bg-[#0E9F6E] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-[#0E9F6E] hover:text-[#0E9F6E]'
                  }`}
                >
                  {occ.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {occasionProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              staggerIndex={idx}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. Markaz Mela Sponsored (Exact 6-column row from video frame 00:01) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-11 lg:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            Markaz Mela Sponsored
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E9F6E] hover:underline whitespace-nowrap shrink-0"
          >
            <span>See all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {melaProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              staggerIndex={idx}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 6. Trending Products — direct from China (Exact 6-column row from video frame 00:02) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-11 lg:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            Trending Products — direct from China
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E9F6E] hover:underline whitespace-nowrap shrink-0"
          >
            <span>See all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {chinaProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              staggerIndex={idx}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 7. Markaz Featured (Exact 6-column row from video frame 00:03) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-11 lg:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            Markaz Featured
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E9F6E] hover:underline whitespace-nowrap shrink-0"
          >
            <span>See all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {featuredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              staggerIndex={idx}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 8. New Products Today (6-column row showcasing additional studio products) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-11 lg:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            New Products Today
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E9F6E] hover:underline whitespace-nowrap shrink-0"
          >
            <span>See all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {newTodayProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              staggerIndex={idx}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 9. Resell & Dropship Strip (Matches frame 00:04) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-10 lg:px-6">
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900 sm:text-lg">
              Want to earn too? Resell &amp; dropship with Markaz
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Share products, set your own margin and earn from home — no investment, no inventory.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'resell' })}
              className="rounded-lg bg-[#0F172A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
            >
              Start reselling
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'resell' })}
              className="text-xs font-semibold text-slate-700 hover:text-[#0E9F6E] whitespace-nowrap"
            >
              Dropshipping portal →
            </button>
          </div>
        </div>
      </section>

      {/* 10. About + FAQ Accordion + Explore strip (Matches frames 00:05-00:06) */}
      <section
        id="markaz-about-section"
        className="mx-auto max-w-[1280px] px-4 pt-10 lg:px-6"
      >
        <h2 className="font-display text-lg font-bold text-slate-900">
          Online shopping in Pakistan, made simple
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
          Markaz is one of Pakistan’s largest online shopping platforms — millions of products at the best prices across fashion, beauty, electronics, home, kids and accessories. Shop trusted Pakistani sellers with fast nationwide delivery, or buy factory-direct from China where Markaz handles freight and customs so your order arrives at your door.
        </p>

        <div id="markaz-faq-section" className="mt-8">
          <h3 className="font-display text-base font-bold text-slate-900">
            Frequently asked questions
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-3 text-left text-xs font-semibold text-slate-800 sm:text-sm"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#0E9F6E]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>Explore:</span>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
              className="text-[#0E9F6E] hover:underline"
            >
              Markaz China
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
              className="text-[#0E9F6E] hover:underline"
            >
              Today&apos;s deals
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'resell' })}
              className="text-[#0E9F6E] hover:underline"
            >
              Dropshipping in Pakistan
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
              className="text-[#0E9F6E] hover:underline"
            >
              Order from China with COD
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
