import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Globe,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Truck,
  Upload,
  X,
} from 'lucide-react';
import {
  CATEGORIES,
  FAQS,
  HERO_DELIVERY_IMAGE,
  OCCASIONS,
  PRODUCTS,
  SHOP_CATEGORY_TILES,
  STUDIO_IMAGES,
  TRENDING_SEARCHES,
} from '../data/catalog';
import {
  AppView,
  CategorySlug,
  MarketplaceOrigin,
  OccasionSlug,
  Product,
  ProductColorVariant,
} from '../types';
import { ProductCard, ProductImage } from './ProductCard';

interface CatalogViewProps {
  mode: 'shop' | 'category' | 'collection' | 'search';
  originFilter?: MarketplaceOrigin;
  categorySlug?: CategorySlug;
  collectionId?: string;
  collectionTitle?: string;
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

const ITEMS_PER_PAGE = 72;

const SHOP_SLIDES = [
  {
    kicker: 'Online shopping in Pakistan',
    title: 'Everything you love, delivered.',
    subtitle:
      'Fashion, beauty, home and more — cash on delivery, fast shipping, easy 7-day returns.',
  },
  {
    kicker: 'Pakistan’s online marketplace',
    title: 'Buy for yourself — or resell and earn.',
    subtitle:
      'Millions shop on Markaz; thousands also resell. Start with just one — there’s no minimum.',
  },
];

interface ProductShelfProps {
  title: string;
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onQuickAdd: (product: Product, color?: ProductColorVariant) => void;
  onSelectProduct: (product: Product) => void;
  onSeeAll: () => void;
}

const ProductShelf: React.FC<ProductShelfProps> = ({
  title,
  products,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
  onSeeAll,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollShelf = (dir: 'left' | 'right') => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({
      left: dir === 'right' ? 680 : -680,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="relative pt-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="font-display text-[17px] font-bold text-slate-900 sm:text-lg">
          {title}
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollShelf('left')}
            aria-label={`Scroll ${title} left`}
            className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollShelf('right')}
            aria-label={`Scroll ${title} right`}
            className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onSeeAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#0E9F6E] whitespace-nowrap"
          >
            <span>See all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth"
      >
        {products.map((product, idx) => (
          <div
            key={`${title}-${product.id}`}
            className="w-[175px] shrink-0 sm:w-[196px]"
          >
            <ProductCard
              product={product}
              staggerIndex={idx % 6}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          </div>
        ))}

        {/* End-of-shelf "See all -> [Collection]" card matching video 00:16 & 00:30 */}
        <button
          type="button"
          onClick={onSeeAll}
          className="flex w-[165px] shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center transition-all hover:border-[#0E9F6E] hover:bg-emerald-50/40 sm:w-[180px]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700">
            <ArrowRight className="h-4 w-4" />
          </span>
          <span className="mt-3 text-xs font-bold text-slate-900">See all</span>
          <span className="mt-0.5 text-[11px] font-medium text-slate-500 line-clamp-2">
            {title}
          </span>
        </button>
      </div>
    </section>
  );
};

/* Helper to build rich 12-card curated shelves from our catalog without empty shelves */
function pickShelf(
  predicate: (p: Product) => boolean,
  offset: number,
  count = 12
): Product[] {
  const matched = PRODUCTS.filter(predicate);
  if (matched.length >= count) {
    return matched.slice(0, count);
  }
  const seen = new Set(matched.map((p) => p.id));
  const padded = [...matched];
  for (let i = 0; i < PRODUCTS.length && padded.length < count; i++) {
    const candidate = PRODUCTS[(i + offset) % PRODUCTS.length];
    if (!seen.has(candidate.id)) {
      seen.add(candidate.id);
      padded.push(candidate);
    }
  }
  return padded;
}

function getCollectionPriorityIds(collectionId?: string): Set<string> {
  switch (collectionId) {
    case 'mela-sponsored':
      return new Set(PRODUCTS.filter((p) => p.sponsored).map((p) => p.id));
    case 'featured':
      return new Set(PRODUCTS.filter((p) => p.featured).map((p) => p.id));
    case 'latest-brands':
      return new Set(
        PRODUCTS.filter(
          (p) => p.category === 'womens-stitched' || p.category === 'womens-unstitched'
        ).map((p) => p.id)
      );
    case 'recent':
      return new Set(
        PRODUCTS.filter((p) => p.category === 'cosmetics' || p.category === 'perfumes').map(
          (p) => p.id
        )
      );
    case 'trending':
      return new Set(PRODUCTS.filter((p) => p.soldCount >= 1800).map((p) => p.id));
    case 'editors-picks':
      return new Set(
        PRODUCTS.filter((p) => p.category === 'bedding' || p.category === 'cosmetics').map(
          (p) => p.id
        )
      );
    case 'bestselling-books':
      return new Set(
        PRODUCTS.filter((p) => p.category === 'books' || p.category === 'accessories').map(
          (p) => p.id
        )
      );
    case 'new-today':
      return new Set(PRODUCTS.filter((p) => p.isNew).map((p) => p.id));
    case 'favs':
      return new Set(
        PRODUCTS.filter((p) => p.category === 'womens-stitched' || p.category === 'bags').map(
          (p) => p.id
        )
      );
    case 'weekly-winners':
      return new Set(
        PRODUCTS.filter((p) => p.category === 'bedding' || p.category === 'kitchenware').map(
          (p) => p.id
        )
      );
    case 'new-deals':
      return new Set(PRODUCTS.filter((p) => (p.discountPercent || 0) >= 24).map((p) => p.id));
    case 'best-deals':
      return new Set(PRODUCTS.filter((p) => p.price <= 2200).map((p) => p.id));
    case 'fast-movers':
      return new Set(
        PRODUCTS.filter((p) => p.origin === 'pakistan' && p.rating >= 4.8).map((p) => p.id)
      );
    case 'popular-city':
      return new Set(
        PRODUCTS.filter(
          (p) => p.supplierCity === 'Lahore' || p.supplierCity === 'Karachi'
        ).map((p) => p.id)
      );
    case 'china-direct':
      return new Set(PRODUCTS.filter((p) => p.origin === 'china').map((p) => p.id));
    case 'fashion-beauty':
      return new Set(
        PRODUCTS.filter(
          (p) =>
            p.category === 'womens-stitched' ||
            p.category === 'womens-unstitched' ||
            p.category === 'cosmetics' ||
            p.category === 'watches-jewellery'
        ).map((p) => p.id)
      );
    case 'home-kitchen':
      return new Set(
        PRODUCTS.filter((p) => p.category === 'kitchenware' || p.category === 'bedding').map(
          (p) => p.id
        )
      );
    default:
      return new Set();
  }
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  mode,
  originFilter,
  categorySlug,
  collectionId,
  collectionTitle,
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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [minRating, setMinRating] = useState<string>('all');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [page, setPage] = useState(1);
  const [slideIdx, setSlideIdx] = useState(0);
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionSlug>('eid-edit');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [visualModalOpen, setVisualModalOpen] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const moreProductsRef = useRef<HTMLDivElement>(null);

  const activeCategory = categorySlug
    ? CATEGORIES.find((c) => c.slug === categorySlug)
    : undefined;

  useEffect(() => {
    setPage(1);
    setSelectedSubCat('all');
    setSelectedCategoryFilter('all');
  }, [mode, originFilter, categorySlug, collectionId, searchQuery]);

  const clearAllFilters = () => {
    setInStockOnly(false);
    setOnSaleOnly(false);
    setBudget('all');
    setSelectedCategoryFilter('all');
    setSelectedSubCat('all');
    setSelectedCity('all');
    setMinRating('all');
    setSelectedColorFilter('all');
    setSortBy('relevance');
    setPage(1);
  };

  const scrollToMoreProducts = (categoryOverride?: string) => {
    if (categoryOverride) {
      setSelectedCategoryFilter(categoryOverride);
      setPage(1);
    }
    moreProductsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeFilterCount =
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (budget !== 'all' ? 1 : 0) +
    (selectedCategoryFilter !== 'all' ? 1 : 0) +
    (selectedSubCat !== 'all' ? 1 : 0) +
    (selectedCity !== 'all' ? 1 : 0) +
    (minRating !== 'all' ? 1 : 0) +
    (selectedColorFilter !== 'all' ? 1 : 0);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const priorityIds =
      mode === 'collection' ? getCollectionPriorityIds(collectionId) : new Set<string>();

    let list = PRODUCTS.filter((p) => {
      if (mode === 'shop' && originFilter === 'china' && p.origin !== 'china') {
        return false;
      }
      if (mode === 'category' && categorySlug && p.category !== categorySlug) {
        return false;
      }
      if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
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
      if (minRating !== 'all' && p.rating < Number(minRating)) return false;
      if (
        selectedColorFilter !== 'all' &&
        !p.colors.some((c) =>
          c.name.toLowerCase().includes(selectedColorFilter.toLowerCase())
        )
      ) {
        return false;
      }

      if (budget === 'under-1000' && p.price >= 1000) return false;
      if (budget === '1000-2000' && (p.price < 1000 || p.price > 2000)) return false;
      if (budget === '2000-3500' && (p.price < 2000 || p.price > 3500)) return false;
      if (budget === '3500-plus' && p.price < 3500) return false;

      return true;
    });

    if (mode === 'collection' && priorityIds.size > 0 && sortBy === 'relevance') {
      list = [...list].sort(
        (a, b) => Number(priorityIds.has(b.id)) - Number(priorityIds.has(a.id))
      );
    } else if (sortBy === 'price-asc') {
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
    collectionId,
    selectedCategoryFilter,
    searchQuery,
    inStockOnly,
    onSaleOnly,
    selectedSubCat,
    selectedCity,
    minRating,
    selectedColorFilter,
    budget,
    sortBy,
  ]);

  const effectiveItemsPerPage = mode === 'collection' ? 108 : ITEMS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / effectiveItemsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * effectiveItemsPerPage,
    safePage * effectiveItemsPerPage
  );

  const cities = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.supplierCity))),
    []
  );

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    moreProductsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Curated 12-card Shelves matching markaz.app/shop video (frames 00:10 - 01:33)
  const shelves = useMemo(() => {
    const occasionMatched = pickShelf(
      (p) => p.occasions.includes(selectedOccasion),
      2,
      12
    );
    return {
      occasionMatched,
      melaSponsored: pickShelf((p) => Boolean(p.sponsored), 0, 12),
      markazFeatured: pickShelf((p) => Boolean(p.featured), 7, 12),
      latestBrands: pickShelf(
        (p) => p.category === 'womens-stitched' || p.category === 'womens-unstitched',
        14,
        12
      ),
      recentCosmetics: pickShelf(
        (p) => p.category === 'cosmetics' || p.category === 'perfumes',
        21,
        12
      ),
      trendingProducts: pickShelf((p) => p.soldCount >= 1800, 28, 12),
      editorsPicks: pickShelf(
        (p) => p.category === 'bedding' || p.category === 'cosmetics',
        35,
        12
      ),
      bestsellingBooks: pickShelf(
        (p) => p.category === 'books' || p.category === 'accessories',
        42,
        12
      ),
      newProductsToday: pickShelf((p) => Boolean(p.isNew), 49, 12),
      favs: pickShelf(
        (p) => p.category === 'womens-stitched' || p.category === 'bags',
        56,
        12
      ),
      weeklyWinners: pickShelf(
        (p) => p.category === 'bedding' || p.category === 'kitchenware',
        63,
        12
      ),
      newDeals: pickShelf((p) => (p.discountPercent || 0) >= 24, 70, 12),
      bestDeals: pickShelf((p) => p.price <= 2200, 77, 12),
      fastMovers: pickShelf((p) => p.origin === 'pakistan' && p.rating >= 4.8, 84, 12),
      popularInCity: pickShelf(
        (p) => p.supplierCity === 'Lahore' || p.supplierCity === 'Karachi',
        91,
        12
      ),
      mightLike: pickShelf((p) => p.origin === 'china' || p.featured === true, 12, 12),
      continueBrowsing: pickShelf((p) => Boolean(p.discountPercent), 19, 8),
      chinaBestSellers: pickShelf((p) => p.origin === 'china' && p.soldCount >= 1600, 3, 10),
      chinaElectronics: pickShelf(
        (p) => p.origin === 'china' && p.category === 'electronics',
        11,
        10
      ),
      chinaHomeKitchen: pickShelf(
        (p) =>
          p.origin === 'china' &&
          (p.category === 'kitchenware' || p.category === 'bedding'),
        22,
        10
      ),
      chinaFashion: pickShelf(
        (p) =>
          p.origin === 'china' &&
          (p.category === 'watches-jewellery' ||
            p.category === 'bags' ||
            p.category === 'shoes' ||
            p.category === 'accessories'),
        33,
        10
      ),
      chinaUnder1800: pickShelf((p) => p.origin === 'china' && p.price <= 1800, 44, 10),
      chinaNewArrivals: pickShelf((p) => p.origin === 'china' && Boolean(p.isNew), 55, 10),
    };
  }, [selectedOccasion]);

  const unstitchedSpotlight =
    PRODUCTS.find((p) => p.id === 'ws-203') || PRODUCTS[0];
  const cosmeticsSpotlight =
    PRODUCTS.find((p) => p.id === 'cm-402') || PRODUCTS[0];
  const jewellerySpotlight =
    PRODUCTS.find((p) => p.id === 'wj-305') || PRODUCTS[0];
  const shoesSpotlight =
    PRODUCTS.find((p) => p.id === 'sh-702') || PRODUCTS[0];
  const electronicsSpotlight =
    PRODUCTS.find((p) => p.id === 'el-501') || PRODUCTS[0];

  const isMainShop = mode === 'shop' && originFilter === 'pakistan';

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6">
      {/* 1. EXACT /shop HERO + ALL 18 CATEGORIES + BENTO + 16 SHELVES */}
      {isMainShop && (
        <div className="mb-10">
          {/* Hero Slider + PK/CN Selector Cards */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
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

          {/* 18 Categories 2-Row Circular Showcase matching video 00:00-00:05 */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Shop by category
              </h2>
              <button
                type="button"
                onClick={() => scrollToMoreProducts()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#0E9F6E]"
              >
                <span>See all</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6 lg:grid-cols-9">
              {SHOP_CATEGORY_TILES.map((tile) => (
                <button
                  key={tile.label}
                  type="button"
                  onClick={() => onNavigate({ type: 'category', slug: tile.slug })}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="mb-1.5 h-20 w-20 overflow-hidden rounded-full border border-slate-200/80 bg-[#F4F5F7] p-1 shadow-2xs transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:border-[#0E9F6E] group-hover:shadow-md sm:h-22 sm:w-22">
                    <ProductImage
                      src={tile.image}
                      alt={tile.label}
                      className="h-full w-full rounded-full object-cover group-hover:scale-110"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 line-clamp-2 group-hover:text-[#0E9F6E]">
                    {tile.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shop by occasion + Editorial Bento + Snap It Visual Search (Video 00:07-00:09) */}
          <div className="mt-10">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Shop by occasion
              </h2>
              <span className="text-xs text-slate-500">
                Pick a vibe, we&apos;ll do the curating.
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {OCCASIONS.map((occ) => {
                const active = selectedOccasion === occ.slug;
                return (
                  <button
                    key={occ.slug}
                    type="button"
                    onClick={() => setSelectedOccasion(occ.slug)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                      active
                        ? 'border-[#0E9F6E] bg-[#0E9F6E] text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-[#0E9F6E]'
                    }`}
                  >
                    {occ.label}
                  </button>
                );
              })}
            </div>

            {/* Curated Bento Grid */}
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Left Editor's Pick Big Banner */}
              <div
                onClick={() =>
                  onNavigate({ type: 'category', slug: 'womens-unstitched' })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onNavigate({ type: 'category', slug: 'womens-unstitched' });
                  }
                }}
                className="group relative flex min-h-[260px] cursor-pointer items-end overflow-hidden rounded-2xl bg-[#102A24] p-6 text-white lg:col-span-5"
              >
                <div className="absolute inset-0">
                  <ProductImage
                    src={unstitchedSpotlight.images[0]}
                    alt="Unstitched, unmatched"
                    className="h-full w-full object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
                </div>
                <div className="relative z-10 max-w-xs">
                  <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                    Editor&apos;s pick
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                    Unstitched, unmatched.
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-200">
                    Lawn, khaddar and chiffon from trusted sellers.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#0E9F6E] px-4 py-2 text-xs font-bold text-white">
                    Browse suits <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* Right 2x2 Category Mini-Banners + China Strip */}
              <div className="grid grid-cols-2 gap-3 lg:col-span-7">
                {[
                  {
                    title: 'Cosmetics',
                    slug: 'cosmetics' as CategorySlug,
                    img: cosmeticsSpotlight.images[0],
                    bg: 'bg-[#FAF0F2]',
                  },
                  {
                    title: 'Jewellery',
                    slug: 'watches-jewellery' as CategorySlug,
                    img: jewellerySpotlight.images[0],
                    bg: 'bg-[#FAF7F0]',
                  },
                  {
                    title: 'Shoes',
                    slug: 'shoes' as CategorySlug,
                    img: shoesSpotlight.images[0],
                    bg: 'bg-[#F3F5F7]',
                  },
                  {
                    title: 'Electronics',
                    slug: 'electronics' as CategorySlug,
                    img: electronicsSpotlight.images[0],
                    bg: 'bg-[#EEF5FA]',
                  },
                ].map((card) => (
                  <button
                    key={card.title}
                    type="button"
                    onClick={() => onNavigate({ type: 'category', slug: card.slug })}
                    className={`group flex items-center justify-between overflow-hidden rounded-2xl border border-slate-200/80 ${card.bg} p-4 text-left transition-all hover:border-[#0E9F6E] hover:shadow-md`}
                  >
                    <div>
                      <p className="font-display text-sm font-bold text-slate-900">
                        {card.title}
                      </p>
                      <span className="mt-1 inline-block text-xs font-semibold text-slate-600 group-hover:text-[#0E9F6E]">
                        Shop now
                      </span>
                    </div>
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-2xs">
                      <ProductImage
                        src={card.img}
                        alt={card.title}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
                  className="col-span-2 flex items-center justify-between rounded-2xl border border-[#F0D7C5] bg-gradient-to-r from-[#FDF6F0] to-[#F7E5D8] px-5 py-4 text-left transition-colors hover:border-[#DE2910]/40"
                >
                  <div>
                    <p className="font-display text-sm font-bold text-slate-900">
                      Factory-direct from China
                    </p>
                    <p className="text-xs text-slate-600">
                      Buy just one — door-to-door across Pakistan.
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#9A3412]">
                      Explore Markaz China <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DE2910] text-xs font-extrabold text-[#FFDE00]">
                    CN
                  </span>
                </button>
              </div>
            </div>

            {/* Snap it. Find it. Visual Search Banner */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#A7F3D0] bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5] px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E9F6E] text-white">
                  <Camera className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Snap it. Find it.
                  </p>
                  <p className="text-xs text-slate-600">
                    Search the catalogue visually or jump straight to trending categories.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVisualModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0E9F6E] px-4 py-2 text-xs font-bold text-white hover:bg-[#057A55]"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Try visual quick search</span>
              </button>
            </div>
          </div>

          {/* Interactive Occasion Shelf */}
          <ProductShelf
            title={`Curated for ${OCCASIONS.find((o) => o.slug === selectedOccasion)?.label || 'You'}`}
            products={shelves.occasionMatched}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'occasion',
                title: `${OCCASIONS.find((o) => o.slug === selectedOccasion)?.label || 'Occasion'} Picks`,
              })
            }
          />

          {/* Markaz Mela Sponsored */}
          <ProductShelf
            title="Markaz Mela Sponsored"
            products={shelves.melaSponsored}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'mela-sponsored',
                title: 'Markaz Mela Sponsored',
              })
            }
          />

          {/* Markaz Featured */}
          <ProductShelf
            title="Markaz Featured"
            products={shelves.markazFeatured}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'featured',
                title: 'Markaz Featured',
              })
            }
          />

          {/* Pink Editor's Pick Banner matching video 00:30 */}
          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#F5D0D8] bg-[#FDF1F4] p-6 sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                EDITOR&apos;S PICK
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-slate-900">
                The looks everyone&apos;s reaching for
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Curated favorites across fashion, beauty and home — refreshed weekly.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onNavigate({
                  type: 'collection',
                  collectionId: 'editors-picks',
                  title: "Editor's Picks",
                })
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-900 hover:border-[#0E9F6E] hover:text-[#0E9F6E] whitespace-nowrap shrink-0"
            >
              <span>Browse all categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Latest Onboarded Brands!! */}
          <ProductShelf
            title="Latest Onboarded Brands!!"
            products={shelves.latestBrands}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'latest-brands',
                title: 'Latest Onboarded Brands!!',
              })
            }
          />

          {/* Recent */}
          <ProductShelf
            title="Recent"
            products={shelves.recentCosmetics}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'recent',
                title: 'Recent',
              })
            }
          />

          {/* Trending Products */}
          <ProductShelf
            title="Trending Products"
            products={shelves.trendingProducts}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'trending',
                title: 'Trending Products',
              })
            }
          />

          {/* Shop from China Full-Width Warm Banner matching video 00:35 */}
          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#F0D7C5] bg-gradient-to-r from-[#FDF5EE] to-[#F4DFCE] p-6 sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A3412]">
                SHOP FROM CHINA
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-slate-900">
                Millions of products. Direct from China.
              </h3>
              <p className="mt-1 text-xs text-slate-700">
                Pay in rupees — no customs hassle. Buy just one, and door-to-door delivery across Pakistan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D9B8A3] bg-white px-5 py-2.5 text-xs font-bold text-slate-900 hover:bg-rose-50 whitespace-nowrap shrink-0"
            >
              <span>Open Markaz China</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Editor's Picks */}
          <ProductShelf
            title="Editor's Picks"
            products={shelves.editorsPicks}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'editors-picks',
                title: "Editor's Picks",
              })
            }
          />

          {/* Bestselling Books */}
          <ProductShelf
            title="Bestselling Books"
            products={shelves.bestsellingBooks}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'bestselling-books',
                title: 'Bestselling Books',
              })
            }
          />

          {/* New Products Today */}
          <ProductShelf
            title="New Products Today"
            products={shelves.newProductsToday}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'new-today',
                title: 'New Products Today',
              })
            }
          />

          {/* Favs */}
          <ProductShelf
            title="Favs"
            products={shelves.favs}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'favs',
                title: 'Favs',
              })
            }
          />

          {/* Weekly Winners */}
          <ProductShelf
            title="Weekly Winners"
            products={shelves.weeklyWinners}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'weekly-winners',
                title: 'Weekly Winners',
              })
            }
          />

          {/* New Deals For You */}
          <ProductShelf
            title="New Deals For You"
            products={shelves.newDeals}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'new-deals',
                title: 'New Deals For You',
              })
            }
          />

          {/* Best Deals For You */}
          <ProductShelf
            title="Best Deals For You"
            products={shelves.bestDeals}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'best-deals',
                title: 'Best Deals For You',
              })
            }
          />

          {/* Fast Movers For You */}
          <ProductShelf
            title="Fast Movers For You"
            products={shelves.fastMovers}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'fast-movers',
                title: 'Fast Movers For You',
              })
            }
          />

          {/* Popular In Your City */}
          <ProductShelf
            title="Popular In Your City"
            products={shelves.popularInCity}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'popular-city',
                title: 'Popular In Your City',
              })
            }
          />

          {/* We Think You Might Like! */}
          <ProductShelf
            title="We Think You Might Like!"
            products={shelves.mightLike}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'might-like',
                title: 'We Think You Might Like!',
              })
            }
          />

          {/* Continue browsing */}
          <ProductShelf
            title="Continue browsing"
            products={shelves.continueBrowsing}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'continue-browsing',
                title: 'Continue browsing',
              })
            }
          />
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

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Browse the China catalogue by category
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
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
              {SHOP_CATEGORY_TILES.map((tile) => (
                <button
                  key={`cn-cat-${tile.label}`}
                  type="button"
                  onClick={() => onNavigate({ type: 'category', slug: tile.slug })}
                  className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-2.5 text-center transition-colors hover:border-[#0E9F6E]"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    <ProductImage
                      src={tile.image}
                      alt={tile.label}
                      className="h-full w-full object-cover group-hover:scale-110"
                    />
                  </div>
                  <span className="mt-1.5 text-[11px] font-semibold text-slate-800 line-clamp-1 group-hover:text-[#0E9F6E]">
                    {tile.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 6 Rich China Shelves (+60 images) */}
          <ProductShelf
            title="China Best Sellers"
            products={shelves.chinaBestSellers}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() => scrollToMoreProducts()}
          />
          <ProductShelf
            title="Factory-Direct Electronics & Smart Gadgets"
            products={shelves.chinaElectronics}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() => scrollToMoreProducts('electronics')}
          />
          <ProductShelf
            title="China Home & Kitchen Essentials"
            products={shelves.chinaHomeKitchen}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() => scrollToMoreProducts('kitchenware')}
          />
          <ProductShelf
            title="Watches, Bags & Accessories from China"
            products={shelves.chinaFashion}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() => scrollToMoreProducts('watches-jewellery')}
          />
          <ProductShelf
            title="Under PKR 1,800 Factory Deals"
            products={shelves.chinaUnder1800}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() => scrollToMoreProducts()}
          />
          <ProductShelf
            title="New Arrivals from China"
            products={shelves.chinaNewArrivals}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() => scrollToMoreProducts()}
          />
        </div>
      )}

      {/* Breadcrumb for Category, Collection & Search */}
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
          {mode === 'collection' && (
            <>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
                className="hover:text-[#0E9F6E]"
              >
                Shop
              </button>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-slate-900">
                {collectionTitle || 'Curated Collection'}
              </span>
            </>
          )}
          {mode === 'search' && (
            <span className="font-semibold text-slate-900">
              Search results {searchQuery ? `for "${searchQuery}"` : ''}
            </span>
          )}
        </nav>
      )}

      {/* Collection Page Header (Matches markaz.app/shop/search "Markaz Mela Sponsored — 96+ products", Video 00:20-00:25) */}
      {mode === 'collection' && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {collectionTitle || 'Featured Collection'}
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {filteredProducts.length} products · Cash on Delivery across Pakistan · 7-day returns
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Back to Shop</span>
          </button>
        </div>
      )}

      {/* 3. Category Hero Banner with 4-image Preview Collage */}
      {mode === 'category' && activeCategory && (
        <div
          className={`mb-6 rounded-2xl border border-slate-200 bg-gradient-to-r ${activeCategory.accentBg} p-6 sm:p-8`}
        >
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
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

            <div className="grid grid-cols-4 gap-2 lg:col-span-4 lg:grid-cols-2">
              {PRODUCTS.filter((p) => p.category === activeCategory.slug)
                .slice(0, 4)
                .map((sample) => (
                  <button
                    key={`cat-prev-${sample.id}`}
                    type="button"
                    onClick={() => onSelectProduct(sample)}
                    className="group aspect-square overflow-hidden rounded-xl border border-white bg-white p-1 shadow-xs"
                  >
                    <ProductImage
                      src={sample.images[0]}
                      alt={sample.title}
                      className="h-full w-full rounded-lg object-cover group-hover:scale-105"
                    />
                  </button>
                ))}
            </div>
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

      {/* MORE PRODUCTS HEADER & FILTER BAR (Video 02:14-03:00) */}
      <div ref={moreProductsRef} className="scroll-mt-24">
        {isMainShop && (
          <h2 className="mb-3 font-display text-lg font-bold text-slate-900">
            More products
          </h2>
        )}

        <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 pr-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              FILTER
            </span>

            {(mode === 'shop' || mode === 'collection') && (
              <select
                aria-label="Filter by category"
                value={selectedCategoryFilter}
                onChange={(e) => {
                  setSelectedCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-[#0E9F6E] focus:outline-none"
              >
                <option value="all">Category: All</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            <select
              aria-label="Filter by rating"
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                setPage(1);
              }}
              className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-[#0E9F6E] focus:outline-none"
            >
              <option value="all">Rating</option>
              <option value="4.8">4.8★ &amp; above</option>
              <option value="4.5">4.5★ &amp; above</option>
              <option value="4.0">4.0★ &amp; above</option>
            </select>

            <select
              aria-label="Filter by color"
              value={selectedColorFilter}
              onChange={(e) => {
                setSelectedColorFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-[#0E9F6E] focus:outline-none"
            >
              <option value="all">Color</option>
              {['Black', 'White', 'Pink', 'Blue', 'Green', 'Gold', 'Brown', 'Red', 'Silver'].map(
                (col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                )
              )}
            </select>

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
              <option value="all">Supplier City</option>
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
            {filteredProducts.length} products
          </span>
          {totalPages > 1 && (
            <span className="font-semibold text-slate-800 tabular-nums">
              Page {safePage} of {totalPages}
            </span>
          )}
        </div>

        {/* 6-Column Product Grid matching markaz.app/shop (72+ cards per page) */}
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
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {paginatedProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                staggerIndex={idx % 6}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-1.5">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => goToPage(safePage - 1)}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
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

      {/* Category, Collection & Search Discovery Booster (Ensures 120+ images & full discovery on every Collection/Category/Search page) */}
      {mode !== 'shop' && (
        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="mb-6">
            <h2 className="mb-4 font-display text-lg font-bold text-slate-900">
              Explore all 18 categories
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
              {SHOP_CATEGORY_TILES.map((tile) => (
                <button
                  key={`cat-jump-${tile.label}`}
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
          </div>

          <ProductShelf
            title="Trending Across Markaz"
            products={shelves.trendingProducts}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'trending',
                title: 'Trending Products',
              })
            }
          />
          <ProductShelf
            title="Best Deals Under PKR 2,500"
            products={shelves.bestDeals}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() =>
              onNavigate({
                type: 'collection',
                collectionId: 'best-deals',
                title: 'Best Deals For You',
              })
            }
          />
          <ProductShelf
            title="Direct from China Factory"
            products={shelves.chinaBestSellers}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
            onSelectProduct={onSelectProduct}
            onSeeAll={() => onNavigate({ type: 'shop', origin: 'china' })}
          />
        </div>
      )}

      {/* Dark Navy "Built for Pakistan. Trusted nationwide." + FAQ Accordion (Video 01:21 - 01:33) */}
      {(mode === 'shop' || mode === 'collection') && (
        <div className="mt-12 space-y-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#0B1F3A] px-6 py-9 text-white sm:px-10 sm:py-11">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 select-none font-display text-[120px] font-black tracking-tighter text-white/[0.04] sm:text-[170px]"
            >
              Markaz
            </span>
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                Built for Pakistan. <span className="text-emerald-300">Trusted nationwide.</span>
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Cash on delivery',
                    desc: 'Pay when it arrives — every city in Pakistan.',
                  },
                  {
                    icon: Truck,
                    title: 'Fast delivery',
                    desc: '2–5 days delivery shipping nationwide.',
                  },
                  {
                    icon: Globe,
                    title: 'Secure payment',
                    desc: 'Your data protected on every order.',
                  },
                  {
                    icon: RotateCcw,
                    title: '7-day returns',
                    desc: 'Easy returns on every order.',
                  },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-xs"
                    >
                      <IconComp className="h-5 w-5 text-emerald-300" />
                      <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-300">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Markaz — common questions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Everything Pakistani shoppers ask before their first Markaz order. Tap a question to expand.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {FAQS.map((faq, idx) => {
                const open = openFaqIndex === idx;
                return (
                  <div
                    key={`shop-faq-${faq.q}`}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(open ? null : idx)}
                      className="flex w-full items-center justify-between gap-3 text-left text-xs font-semibold text-slate-800 sm:text-sm"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                          open ? 'rotate-180 text-[#0E9F6E]' : ''
                        }`}
                      />
                    </button>
                    {open && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">{faq.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Interactive "Snap it. Find it." AI Visual Search Modal */}
      {visualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[1px]">
          <div
            role="dialog"
            aria-label="Snap it Visual Search"
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0E9F6E]" />
                <span className="font-display text-base font-bold text-slate-900">
                  Snap it. Find it. — Visual Search
                </span>
              </div>
              <button
                type="button"
                onClick={() => setVisualModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-center transition-colors hover:bg-emerald-50">
                <Upload className="h-7 w-7 text-[#0E9F6E]" />
                <p className="mt-2 text-xs font-bold text-slate-900">
                  Upload a product screenshot or photo
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  JPG, PNG supported — matches similar wholesale listings instantly
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setUploadedPreview(String(reader.result || ''));
                        setTimeout(() => {
                          setVisualModalOpen(false);
                          onSearchSubmit('watch');
                        }, 600);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              {uploadedPreview && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
                  <img
                    src={uploadedPreview}
                    alt="Uploaded visual preview"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span>Matching catalog items...</span>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-bold text-slate-700">
                  Or tap any visual sample to find similar items:
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: 'Lawn Suits', query: 'lawn', img: STUDIO_IMAGES.lawnEmerald },
                    { label: 'Watches', query: 'watch', img: STUDIO_IMAGES.chronoWatch },
                    { label: 'Sneakers', query: 'shoes', img: STUDIO_IMAGES.shoesWhite },
                    { label: 'Makeup Kits', query: 'makeup', img: STUDIO_IMAGES.cosmetics },
                    { label: 'Handbags', query: 'bag', img: STUDIO_IMAGES.bag },
                    { label: 'Earbuds', query: 'earbuds', img: STUDIO_IMAGES.earbuds },
                  ].map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => {
                        setVisualModalOpen(false);
                        onSearchSubmit(sample.query);
                      }}
                      className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left hover:border-[#0E9F6E]"
                    >
                      <div className="aspect-square bg-slate-100">
                        <ProductImage
                          src={sample.img}
                          alt={sample.label}
                          className="h-full w-full object-cover group-hover:scale-105"
                        />
                      </div>
                      <p className="px-2 py-1.5 text-[11px] font-semibold text-slate-800">
                        {sample.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
