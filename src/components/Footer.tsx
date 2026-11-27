import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { CATEGORIES, TRENDING_SEARCHES } from '../data/catalog';
import { AppView } from '../types';
import { MarkazLogo } from './MarkazLogo';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onSearchSubmit: (query: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSearchSubmit }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      {/* Bottom CTA Strip (Exact Markaz Indigo-Teal gradient matching hero) */}
      <div className="bg-[radial-gradient(ellipse_at_bottom_right,_#13795B_0%,_#0F4C5C_45%,_#181A63_85%,_#1B1352_100%)] px-4 py-10 text-center text-white">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Start shopping on Markaz
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-200/90">
          Millions of products at the best prices — cash on delivery, 7-day returns, no minimum order.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="rounded-full border border-[#6CC320] bg-[#8FE041] px-6 py-2.5 text-xs font-bold text-[#112A12] transition-colors hover:bg-[#7ED42E]"
          >
            Browse all products →
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
            className="rounded-full bg-white px-6 py-2.5 text-xs font-bold text-slate-900 transition-colors hover:bg-emerald-50"
          >
            Shop from China
          </button>
        </div>
      </div>

      {/* Main Footer Columns matching video frame 00:07 */}
      <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand Summary */}
          <div className="lg:col-span-2">
            <MarkazLogo size="sm" />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500">
              Pakistan’s online marketplace — millions of products at the best prices, with cash on delivery, 7-day returns and earn from home.
            </p>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
              SHOP
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              {CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => onNavigate({ type: 'category', slug: cat.slug })}
                    className="hover:text-[#0E9F6E]"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* SHOP FROM CHINA */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
              SHOP FROM CHINA
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'shop', origin: 'china' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Browse Markaz China
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'category', slug: 'electronics' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Order from China (COD)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'category', slug: 'kitchenware' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Direct Kitchenware
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'category', slug: 'watches-jewellery' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Buy direct from factories
                </button>
              </li>
            </ul>
          </div>

          {/* EARN WITH MARKAZ */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
              EARN WITH MARKAZ
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'reseller-app' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Reselling app
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'resell' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Dropshipping portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'shopify' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Export to Shopify
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'woocommerce' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Export to WooCommerce
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'export-data' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Export product data
                </button>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
              COMPANY
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'about' })}
                  className="hover:text-[#0E9F6E]"
                >
                  About Markaz
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'blog' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'affiliate' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Affiliate program
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'supplier' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Become a supplier
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'contact' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Contact &amp; Content Hub
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'orders' })}
                  className="hover:text-[#0E9F6E]"
                >
                  Order history
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'wishlist' })}
                  className="hover:text-[#0E9F6E]"
                >
                  My favorites
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Popular Searches Pills matching video frame 00:08 */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-900">
            POPULAR SEARCHES
          </p>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSearchSubmit(term)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Offices Row */}
        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 text-xs text-slate-600 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="font-bold text-slate-800">Pakistan office</p>
            <div className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>Street No. 34, Sector G-9/1, Islamabad, Pakistan</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                +92 302 2222277
              </span>
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                hello@markaz.app
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-slate-800">US office</p>
            <div className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>2510 North Church Street, Wilmington, DE, 19802</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>+1 302 8030860 · hello@markaz.app</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 Markaz Inc, Pakistan. All rights reserved.</p>
          <p>Terms &amp; Conditions · Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};
