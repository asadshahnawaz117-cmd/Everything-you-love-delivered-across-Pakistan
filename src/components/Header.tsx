import React, { useEffect, useState } from 'react';
import {
  Camera,
  ChevronDown,
  Globe,
  Heart,
  Menu,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Truck,
  User,
  X,
} from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { MarkazLogo } from './MarkazLogo';

interface HeaderProps {
  currentView: AppView;
  searchQuery: string;
  cartCount: number;
  wishlistCount: number;
  ordersCount: number;
  user: UserProfile | null;
  lang: 'en' | 'ur';
  onToggleLang: () => void;
  onNavigate: (view: AppView) => void;
  onSearchSubmit: (query: string) => void;
  onOpenCart: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchQuery,
  cartCount,
  wishlistCount,
  ordersCount,
  user,
  lang,
  onToggleLang,
  onNavigate,
  onSearchSubmit,
  onOpenCart,
  onOpenLogin,
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(inputValue.trim());
    setMobileMenuOpen(false);
  };

  const isLandingHome = currentView.type === 'home';
  const isChinaActive =
    currentView.type === 'shop' && currentView.origin === 'china';

  /* ================= 1. LANDING HEADER (Exact match to markaz.app screenshot) ================= */
  if (isLandingHome) {
    return (
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-7">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'home' })}
              className="whitespace-nowrap shrink-0 focus-visible:outline-none"
            >
              <MarkazLogo />
            </button>

            <nav className="hidden items-center gap-6 text-[13.5px] font-medium text-[#334155] lg:flex">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                  className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 hover:text-[#16A34A]"
                >
                  <span>Products</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
                {productsDropdownOpen && (
                  <div
                    onMouseLeave={() => setProductsDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setProductsDropdownOpen(false);
                        onNavigate({ type: 'shop', origin: 'pakistan' });
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      Shop from Pakistan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductsDropdownOpen(false);
                        onNavigate({ type: 'shop', origin: 'china' });
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      Shop from China
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductsDropdownOpen(false);
                        onNavigate({ type: 'category', slug: 'womens-stitched' });
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Women&apos;s Stitched
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductsDropdownOpen(false);
                        onNavigate({ type: 'category', slug: 'cosmetics' });
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Cosmetics &amp; Perfumes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductsDropdownOpen(false);
                        onNavigate({ type: 'category', slug: 'kitchenware' });
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Kitchenware
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('markaz-about-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="whitespace-nowrap shrink-0 hover:text-[#16A34A]"
              >
                About Us
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('markaz-faq-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="whitespace-nowrap shrink-0 hover:text-[#16A34A]"
              >
                Blog
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'resell' })}
                className="whitespace-nowrap shrink-0 hover:text-[#16A34A]"
              >
                Become a Supplier
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'resell' })}
                className="whitespace-nowrap shrink-0 hover:text-[#16A34A]"
              >
                Affiliate
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
                className="whitespace-nowrap shrink-0 hover:text-[#16A34A]"
              >
                Shop Now
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Globe + اردو Pill matching screenshot */}
            <button
              type="button"
              onClick={onToggleLang}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
              title="Switch language"
            >
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>{lang === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* Cart Icon (quick access when browsing) */}
            {cartCount > 0 && (
              <button
                type="button"
                onClick={onOpenCart}
                aria-label="Open Cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="font-mono-num absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#16A34A] px-1 text-[10px] font-bold text-white tabular-nums">
                  {cartCount}
                </span>
              </button>
            )}

            {/* Lime/Chartreuse Rounded-Full Download the App Button */}
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
              className="hidden sm:inline-flex h-9 items-center gap-2 rounded-full border border-[#6CC320] bg-[#8FE041] px-5 text-[13px] font-semibold text-[#112A12] shadow-2xs transition-colors hover:bg-[#7ED42E] whitespace-nowrap shrink-0"
            >
              Download the App
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  onNavigate({ type: 'shop', origin: 'pakistan' });
                  setMobileMenuOpen(false);
                }}
                className="rounded-full bg-[#8FE041] border border-[#6CC320] px-3 py-2 text-center font-semibold text-[#112A12]"
              >
                Shop Pakistan
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate({ type: 'shop', origin: 'china' });
                  setMobileMenuOpen(false);
                }}
                className="rounded-full border border-slate-200 px-3 py-2 text-center text-slate-800"
              >
                Shop from China
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate({ type: 'resell' });
                  setMobileMenuOpen(false);
                }}
                className="rounded-full border border-slate-200 px-3 py-2 text-slate-700"
              >
                Resell &amp; Earn
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate({ type: 'orders' });
                  setMobileMenuOpen(false);
                }}
                className="rounded-full border border-slate-200 px-3 py-2 text-slate-700"
              >
                My Orders ({ordersCount})
              </button>
            </div>
          </div>
        )}
      </header>
    );
  }

  /* ================= 2. SHOP / CATALOG / PDP HEADER (markaz.app/shop) ================= */
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      {/* Dark Forest Green Promise Bar */}
      <div className="hidden h-8 items-center justify-center bg-[#092319] px-4 text-[12px] font-medium text-emerald-50 sm:flex">
        <div className="flex w-full max-w-[1280px] items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-emerald-400" />
            Lowest delivery price in Pakistan
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-emerald-400" />
            Cash on Delivery available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5 text-emerald-400" />
            7-day easy returns
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Verified Suppliers
          </span>
        </div>
      </div>

      {/* Main Shop Search Header */}
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-2.5 lg:gap-6 lg:px-6">
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ type: 'home' })}
            className="whitespace-nowrap shrink-0 focus-visible:outline-none"
          >
            <MarkazLogo size="sm" />
          </button>
        </div>

        {/* Wide Pill Search Bar matching video */}
        <form
          onSubmit={handleSubmit}
          className="hidden flex-1 max-w-2xl items-center rounded-full border border-slate-300 bg-white p-1 pl-4 shadow-xs focus-within:border-[#00B87C] md:flex"
        >
          <Search className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isChinaActive
                ? 'Shop from China — search by name or code'
                : 'Search products, brands & stores'
            }
            className="h-8 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onSearchSubmit('shoes')}
            title="Visual quick search"
            className="mr-1.5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 shrink-0"
          >
            <Camera className="h-4 w-4" />
          </button>
          <button
            type="submit"
            className="h-8 rounded-full bg-[#00C48C] px-5 text-xs font-bold text-[#052E24] transition-colors hover:bg-[#00A878] whitespace-nowrap shrink-0"
          >
            Search
          </button>
        </form>

        {/* Right Utility Links: Log in · Orders · Wishlist · Cart */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenLogin}
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap"
          >
            <User className="h-4 w-4 text-slate-500" />
            <span>{user ? user.name.split(' ')[0] : 'Log in'}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ type: 'orders' })}
            className={`hidden md:flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold whitespace-nowrap ${
              currentView.type === 'orders'
                ? 'bg-emerald-50 text-[#057A55]'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <PackageCheck className="h-4 w-4 text-slate-500" />
            <span>Orders</span>
            {ordersCount > 0 && (
              <span className="font-mono-num text-[11px] font-bold text-[#057A55] tabular-nums">
                ({ordersCount})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ type: 'wishlist' })}
            className={`flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold whitespace-nowrap ${
              currentView.type === 'wishlist'
                ? 'bg-rose-50 text-rose-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${
                wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
              }`}
            />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="font-mono-num text-[11px] tabular-nums">
                ({wishlistCount})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#057A55] whitespace-nowrap"
          >
            <ShoppingCart className="h-4 w-4 text-[#0E9F6E]" />
            <span>Cart</span>
            <span className="font-mono-num rounded-full bg-[#0E9F6E] px-1.5 py-0.5 text-[11px] font-bold text-white tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-navigation strip shown on Shop & China pages */}
      <div className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center gap-5 overflow-x-auto px-4 py-2 text-xs font-medium text-slate-600 no-scrollbar lg:px-6">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className={`whitespace-nowrap shrink-0 hover:text-[#0E9F6E] ${
              currentView.type === 'shop' && currentView.origin === 'pakistan'
                ? 'font-bold text-[#0E9F6E]'
                : ''
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
            className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 hover:text-[#0E9F6E] ${
              isChinaActive ? 'font-bold text-[#0E9F6E]' : ''
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-rose-500" />
            China
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'category', slug: 'kids-clothing' })}
            className="whitespace-nowrap shrink-0 hover:text-[#0E9F6E]"
          >
            Kids &amp; Mother
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'category', slug: 'books' })}
            className="whitespace-nowrap shrink-0 hover:text-[#0E9F6E]"
          >
            Urdu Bazaar
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'category', slug: 'cosmetics' })}
            className="whitespace-nowrap shrink-0 hover:text-[#0E9F6E]"
          >
            Beauty &amp; Care
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'category', slug: 'mens-stitched' })}
            className="whitespace-nowrap shrink-0 hover:text-[#0E9F6E]"
          >
            Men&apos;s Fashion
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'category', slug: 'kitchenware' })}
            className="whitespace-nowrap shrink-0 hover:text-[#0E9F6E]"
          >
            Home &amp; Living
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'category', slug: 'electronics' })}
            className="whitespace-nowrap shrink-0 hover:text-[#0E9F6E]"
          >
            Tools &amp; Tech
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'category', slug: 'shoes' })}
            className="whitespace-nowrap shrink-0 hover:text-[#0E9F6E]"
          >
            Footwear
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'resell' })}
            className="ml-auto font-semibold text-[#0E9F6E] whitespace-nowrap shrink-0 hover:underline"
          >
            Resell &amp; Earn
          </button>
        </div>
      </div>

      {/* Mobile Search Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <form onSubmit={handleSubmit} className="mb-3 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products, brands & stores"
              className="h-9 flex-1 rounded-l-lg border border-r-0 border-slate-300 px-3 text-sm focus:border-[#0E9F6E] focus:outline-none"
            />
            <button
              type="submit"
              className="h-9 rounded-r-lg bg-[#0E9F6E] px-4 text-xs font-semibold text-white"
            >
              Search
            </button>
          </form>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            >
              {user ? user.name : 'Log in'}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate({ type: 'orders' });
                setMobileMenuOpen(false);
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            >
              Orders ({ordersCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
