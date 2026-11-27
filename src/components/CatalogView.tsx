import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Globe,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
  X,
} from 'lucide-react';
import {
  CATEGORIES,
  HERO_DELIVERY_IMAGE,
  PRODUCTS,
  TRENDING_SEARCHES,
} from '../data/catalog';
import { AppView, CategorySlug, MarketplaceOrigin, Product, ProductColorVariant } from '../types';
import { ProductCard, ProductImage } from './ProductCard';

interface CatalogViewProps {
  mode: 'shop' | 'category' | 'search';
  originFilter?: MarketplaceOrigin;
  categorySlug?: CategorySlug;
  searchQuery?: string;
  recentSearches: string[];
  wishlistIds: string[];
  onNavigate: (view: AppView) => void;
  onSearchSubmit: (query: string) => void;
  onRemoveRecentSearch: (term: string) => void;
  onToggleWishlist: (id: string) => void;
  onQuickAdd: (product: Product, color?: ProductColorVariant) => void;
  onSelectProduct: (product: Product) => void;
}

type BudgetBucket = 'all' | 'under-1000' | '1000-2000' | '2000-3500' | '3500-plus';
type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

const ITEMS_PER_PAGE = 12;

const SHOP_SLIDES = [
  {
    kicker: 'Online shopping in Pakistan',
    title: 'Everything you love, delivered.',
    subtitle: 'Fashion, beauty, home and more — cash on delivery, fast shipping, easy 7-day returns.',
  },
  {
    kicker: 'Pakistan’s online marketplace',
    title: 'Thousands of products, best prices.',
    subtitle: 'Shop trusted Pakistani sellers — cash on delivery, fast delivery, easy returns on every order.',
  },
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  mode,
  originFilter,
  categorySlug,
  searchQuery = '',
  recentSearches,
  wishlistIds,
  onNavigate,
  onSearchSubmit,
  onRemoveRecentSearch,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
}) => {
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [budget, setBudget] = useState<BudgetBucket>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [page, setPage] = useState(1);
  const [slideIdx, setSlideIdx] = useState(0);

  const activeCategory = categorySlug
    ? CATEGORIES.find((c) => c.slug === categorySlug)
    : undefined;

  useEffect(() => {
    setPage(1);
    setSelectedSubCat('all');
  }, [mode, originFilter, categorySlug, searchQuery]);

  const clearAllFilters = () => {
    setInStockOnly(false);
    setOnSaleOnly(false);
    setBudget('all');
    setSelectedSubCat('all');
    setSelectedCity('all');
    setSortBy('relevance');
    setPage(1);
  };

  const activeFilterCount =
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (budget !== 'all' ? 1 : 0) +
    (selectedSubCat !== 'all' ? 1 : 0) +
    (selectedCity !== 'all' ? 1 : 0);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = PRODUCTS.filter((p) => {
      if (mode === 'shop' && originFilter && p.origin !== originFilter) {
        return false;
      }
      if (mode === 'category' && categorySlug && p.category !== categorySlug) {
        return false;
      }
      if (mode === 'search' && q) {
        const haystack = `${p.title} ${p.categoryLabel} ${p.subCategory} ${p.tags.join(' ')} ${p.sku} ${p.supplierCity}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (inStockOnly && !p.inStock) return false;
      if (onSaleOnly && !p.discountPercent) return false;
      if (selectedSubCat !== 'all' && p.subCategory !== selectedSubCat) return false;
      if (selectedCity !== 'all' && p.supplierCity !== selectedCity) return false;

      if (budget === 'under-1000' && p.price >= 1000) return false;
      if (budget === '1000-2000' && (p.price < 1000 || p.price > 2000)) return false;
      if (budget === '2000-3500' && (p.price < 2000 || p.price > 3500)) return false;
      if (budget === '3500-plus' && p.price < 3500) return false;

      return true;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating || b.soldCount - a.soldCount);
    }

    return list;
  }, [
    mode,
    originFilter,
    categorySlug,
    searchQuery,
    inStockOnly,
    onSaleOnly,
    selectedSubCat,
    selectedCity,
    budget,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const cities = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.supplierCity))),
    []
  );

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6">
      {/* 1. EXACT /shop HERO BANNER (Frames 03:01 & 04:45) */}
      {mode === 'shop' && originFilter === 'pakistan' && (
        <div className="mb-8 space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left Green Carousel Banner */}
            <div className="relative flex min-h-[210px] items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#076B3E] via-[#0D8A4F] to-[#13A35E] p-6 text-white lg:col-span-8 sm:p-8">
              <div className="relative z-10 max-w-md">
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-emerald-50">
                  {SHOP_SLIDES[slideIdx].kicker}
                </span>
                <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                  {SHOP_SLIDES[slideIdx].title}
                </h1>
                <p className="mt-2 text-xs leading-relaxed text-emerald-50/90 sm:text-sm">
                  {SHOP_SLIDES[slideIdx].subtitle}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() =>
                      setSlideIdx((s) => (s === 0 ? SHOP_SLIDES.length - 1 : s - 1))
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/35"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() =>
                      setSlideIdx((s) => (s + 1) % SHOP_SLIDES.length)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/35"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="animate-gentle-float hidden h-48 w-56 shrink-0 overflow-hidden rounded-xl shadow-2xl ring-2 ring-white/25 sm:block">
                <ProductImage
                  src={HERO_DELIVERY_IMAGE}
                  alt="Markaz Delivery Courier"
                  className="h-full w-full object-cover object-top hover:scale-105"
                />
              </div>
            </div>

            {/* Right Two Selector Cards: Shop from Pakistan (active) / Shop from China */}
            <div className="flex flex-col gap-3 lg:col-span-4">
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
                className="flex flex-1 items-center justify-between rounded-2xl border-2 border-[#0E9F6E] bg-emerald-50/60 p-5 text-left"
              >
                <div>
                  <span className="text-[11px] font-bold text-[#0E9F6E]">
                    You&apos;re here
                  </span>
                  <p className="mt-0.5 font-display text-lg font-bold text-slate-900">
                    Shop from Pakistan →
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#01411C] text-xs font-bold text-white">
                  PK
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
                className="flex flex-1 items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-rose-300 hover:bg-rose-50/30"
              >
                <div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Factory-direct prices
                  </span>
                  <p className="mt-0.5 font-display text-lg font-bold text-slate-900">
                    Shop from China →
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DE2910] text-xs font-bold text-[#FFDE00]">
                  CN
                </span>
              </button>
            </div>
          </div>

          {/* Shop by Category Strip */}
          <div>
            <h2 className="mb-3 font-display text-lg font-bold text-slate-900">
              Shop by category
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onNavigate({ type: 'category', slug: cat.slug })}
                  className="group flex w-20 shrink-0 flex-col items-center text-center"
                >
                  <div className="mb-1.5 h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100 p-0.5 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:border-[#0E9F6E] group-hover:shadow-md">
                    <ProductImage
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full rounded-full object-cover group-hover:scale-110"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 line-clamp-2 group-hover:text-[#0E9F6E]">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. EXACT /china HERO BANNER (Frames 03:34 - 03:56) */}
      {mode === 'shop' && originFilter === 'china' && (
        <div className="mb-8 space-y-6">
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#F0D7C5] bg-gradient-to-r from-[#FDF5EE] to-[#F4DFCE] p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="inline-block rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#9A3412]">
                China direct to Pakistan
              </span>
              <h1 className="mt-3 font-display text-2xl font-extrabold text-slate-900 sm:text-4xl">
                Millions of products at China prices.
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-700">
                Pay online in rupees — no customs hassle. Buy just one and we ship it to your door anywhere in Pakistan.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-5">
              <div className="rounded-xl border border-white/60 bg-white/75 p-4">
                <p className="text-xs font-bold text-slate-900">Buy just one</p>
                <p className="mt-0.5 text-xs text-slate-600">
                  No minimum order — test any product
                </p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white/75 p-4">
                <p className="text-xs font-bold text-slate-900">Door to door</p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Freight &amp; customs handled for you (10–17 days)
                </p>
              </div>
            </div>
          </div>

          {/* 4 China Value Boxes */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
              <ShieldCheck className="h-5 w-5 text-[#0E9F6E] shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Secure online payment</p>
                <p className="text-[11px] text-slate-500">Paid in PKR, no hidden fees</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
              <Globe className="h-5 w-5 text-[#0E9F6E] shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">No minimum order</p>
                <p className="text-[11px] text-slate-500">Buy just one item</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
              <Truck className="h-5 w-5 text-[#0E9F6E] shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Door-to-door</p>
                <p className="text-[11px] text-slate-500">Delivered across Pakistan</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
              <Search className="h-5 w-5 text-[#0E9F6E] shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Instant search</p>
                <p className="text-[11px] text-slate-500">Find factory SKUs fast</p>
              </div>
            </div>
          </div>

          {/* Browse the Catalogue Grid */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Browse the catalogue
              </h2>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E9F6E] hover:underline"
              >
                <span>Switch to Pakistan catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {CATEGORIES.slice(0, 12).map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onNavigate({ type: 'category', slug: cat.slug })}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-[#0E9F6E]"
                >
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <ProductImage
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {cat.name}
                    </p>
                    <p className="font-mono-num text-[11px] text-slate-500 tabular-nums">
                      {cat.productCountLabel}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb for Category & Search */}
      {mode !== 'shop' && (
        <nav className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'home' })}
            className="hover:text-[#0E9F6E]"
          >
            Home
          </button>
          <span aria-hidden="true">/</span>
          {mode === 'category' && activeCategory && (
            <>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
                className="hover:text-[#0E9F6E]"
              >
                Shop
              </button>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-slate-900">{activeCategory.name}</span>
            </>
          )}
          {mode === 'search' && (
            <span className="font-semibold text-slate-900">
              Search results {searchQuery ? `for "${searchQuery}"` : ''}
            </span>
          )}
        </nav>
      )}

      {/* 3. Category Hero Banner (Matches frames 00:12, 00:16, 00:25, 04:49) */}
      {mode === 'category' && activeCategory && (
        <div
          className={`mb-6 rounded-2xl border border-slate-200 bg-gradient-to-r ${activeCategory.accentBg} p-6 sm:p-8`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0E9F6E]">
            SHOP {activeCategory.name.toUpperCase()}
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {activeCategory.heroTitle}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
            {activeCategory.heroSubtitle}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedSubCat('all');
                setPage(1);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedSubCat === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-[#0E9F6E]'
              }`}
            >
              All {activeCategory.name}
            </button>
            {activeCategory.subCategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  setSelectedSubCat(sub);
                  setPage(1);
                }}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedSubCat === sub
                    ? 'bg-[#0E9F6E] text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-[#0E9F6E]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Header */}
      {mode === 'search' && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                SEARCH RESULTS
              </p>
              <h1 className="mt-0.5 font-display text-2xl font-bold text-slate-900">
                {searchQuery ? `"${searchQuery}"` : 'Search Discovery'}
              </h1>
            </div>
            <span className="font-mono-num text-sm font-medium text-slate-600 tabular-nums">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Recent searches:</span>
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    <button
                      type="button"
                      onClick={() => onSearchSubmit(term)}
                      className="hover:text-[#0E9F6E]"
                    >
                      {term}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveRecentSearch(term)}
                      aria-label={`Remove ${term}`}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Search Discovery:</span>
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSearchSubmit(term)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter & Sort Toolbar (Exact pill filter bar from video 06:10) */}
      <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 pr-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            FILTERS
          </span>

          <button
            type="button"
            onClick={() => {
              setInStockOnly(!inStockOnly);
              setPage(1);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
              inStockOnly
                ? 'border-[#0E9F6E] bg-emerald-50 text-[#057A55]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            In stock
          </button>

          <button
            type="button"
            onClick={() => {
              setOnSaleOnly(!onSaleOnly);
              setPage(1);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
              onSaleOnly
                ? 'border-[#0E9F6E] bg-emerald-50 text-[#057A55]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            On sale
          </button>

          {(
            [
              { id: 'under-1000', label: 'Under 1,000' },
              { id: '1000-2000', label: '1,000–2,000' },
              { id: '2000-3500', label: '2,000–3,500' },
              { id: '3500-plus', label: '3,500+' },
            ] as { id: BudgetBucket; label: string }[]
          ).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setBudget(budget === b.id ? 'all' : b.id);
                setPage(1);
              }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                budget === b.id
                  ? 'border-[#0E9F6E] bg-emerald-50 text-[#057A55]'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {b.label}
            </button>
          ))}

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 whitespace-nowrap"
            >
              <X className="h-3.5 w-3.5" />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            aria-label="Filter by supplier city"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setPage(1);
            }}
            className="h-8 rounded-lg border border-slate-200 bg-[#F7F8FA] px-2.5 text-xs font-medium text-slate-700 focus:border-[#0E9F6E] focus:outline-none"
          >
            <option value="all">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setPage(1);
            }}
            className="h-8 rounded-lg border border-slate-200 bg-[#F7F8FA] px-2.5 text-xs font-medium text-slate-700 focus:border-[#0E9F6E] focus:outline-none"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Page Indicator */}
      <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
        <span className="tabular-nums">
          {filteredProducts.length} products found
        </span>
        {totalPages > 1 && (
          <span className="font-semibold text-slate-800 tabular-nums">
            Page {safePage} of {totalPages}
          </span>
        )}
      </div>

      {/* Product Grid or Clear Filters Empty State (frame 06:24) */}
      {paginatedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">
            No loaded results match these filters
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-500">
            Clear a filter, or load more results and try again.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#0E9F6E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#057A55]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {paginatedProducts.map((product, idx) => (
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
      )}

      {/* Pagination (Exact Markaz style: ← Prev  1  2  3  Next →) */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-1.5">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => goToPage(safePage - 1)}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => goToPage(num)}
              className={`h-9 w-9 rounded-full text-xs font-bold tabular-nums transition-colors ${
                num === safePage
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => goToPage(safePage + 1)}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
