import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Globe,
  Layers,
  Package,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Truck,
  Wallet,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/catalog';
import { AppView } from '../../types';
import { ProductImage } from '../ProductCard';

interface PageNavProps {
  onNavigate: (view: AppView) => void;
}

/* Helper to actually download a real CSV from Markaz catalog */
function downloadCatalogCsv(format: 'shopify' | 'woocommerce' | 'excel', marginPkr: number) {
  const headers =
    format === 'shopify'
      ? ['Handle', 'Title', 'Vendor', 'Product Category', 'Type', 'Tags', 'Published', 'Variant SKU', 'Variant Price', 'Image Src', 'Status']
      : format === 'woocommerce'
      ? ['SKU', 'Name', 'Published', 'Short description', 'Categories', 'Regular price', 'Images', 'In stock?']
      : ['SKU', 'Title', 'Category', 'Origin', 'Wholesale_PKR', 'Resell_Margin_PKR', 'Retail_Price_PKR', 'Stock', 'Image'];

  const rows = PRODUCTS.slice(0, 25).map((p) => {
    const retail = p.price + marginPkr;
    const imgUrl = p.images[0] || '';
    if (format === 'shopify') {
      return [
        p.slug,
        `"${p.title.replace(/"/g, '""')}"`,
        'Markaz',
        `"${p.categoryLabel}"`,
        `"${p.subCategory}"`,
        `"${p.tags.join(', ')}"`,
        'TRUE',
        p.sku,
        retail,
        imgUrl,
        'draft',
      ].join(',');
    }
    if (format === 'woocommerce') {
      return [
        p.sku,
        `"${p.title.replace(/"/g, '""')}"`,
        1,
        `"${p.highlights.material} — ${p.highlights.packageIncludes}"`,
        `"${p.categoryLabel} > ${p.subCategory}"`,
        retail,
        imgUrl,
        p.inStock ? 1 : 0,
      ].join(',');
    }
    return [
      p.sku,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.categoryLabel}"`,
      p.origin,
      p.price,
      marginPkr,
      retail,
      p.stockCount,
      imgUrl,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `markaz-${format}-catalog.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ================= 1. DROPSHIPPING PORTAL (Video 00:04 & 00:59–01:17) ================= */
export const DropshippingPortalPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  const [monthlyOrders, setMonthlyOrders] = useState(40);
  const [avgMargin, setAvgMargin] = useState(500);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is dropshipping?',
      a: 'Dropshipping means selling products you never keep in stock. Your customer orders from you, the supplier ships the parcel directly, and your profit is the difference between supplier cost and selling price.',
    },
    {
      q: 'How much investment do I need to start?',
      a: 'None. Joining Markaz is free and you do not buy stock upfront — you only place an order after your customer has ordered from you.',
    },
    {
      q: 'Do I need a license to dropship in Pakistan?',
      a: 'No license is required to begin dropshipping in Pakistan with Markaz. You can start as an individual seller or connect your Shopify/WooCommerce brand.',
    },
    {
      q: 'How do returns and cash on delivery work?',
      a: 'Markaz collects COD payment from your customer via TCS, Leopards, or PostEx, handles 7-day quality returns, and credits your profit automatically.',
    },
  ];

  return (
    <div className="bg-white pb-12">
      {/* Hero Split (Matches video 00:04) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-10 pb-12 lg:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Sell More, Earn More. Hassle-Free Dropshipping with Markaz
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Join the e-commerce revolution with Markaz Dropshipping. Our user-friendly platform simplifies operations, and boosts your bottom line.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate({ type: 'export-data' })}
                className="rounded-full border border-[#6CC320] bg-[#8FE041] px-6 py-2.5 text-xs font-bold text-[#112A12] shadow-xs hover:bg-[#7ED42E]"
              >
                Start Selling Now
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
                className="rounded-full border border-slate-200 px-6 py-2.5 text-xs font-semibold text-slate-700 hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
              >
                Browse Products →
              </button>
            </div>
          </div>

          {/* Right Dashboard Mockup (Matches video 00:04) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-bold text-slate-700">
                    Markaz Dropshipping Portal
                  </span>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#0E9F6E]">
                  Live Catalog Sync
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {PRODUCTS.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onNavigate({ type: 'product', productId: p.id })}
                    className="group overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-1.5 text-left hover:border-[#0E9F6E]"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded bg-white">
                      <ProductImage
                        src={p.images[0]}
                        alt={p.title}
                        className="h-full w-full group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-1 truncate text-[10px] font-semibold text-slate-800">
                      {p.title}
                    </p>
                    <p className="font-mono-num text-[10px] font-bold text-[#0E9F6E]">
                      PKR {p.price.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maximize Profit + Features (Matches video 01:01–01:02) */}
      <section className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6">
        <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Maximize Profit, Minimize Effort
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Elevate your business with Markaz! We manage finances, offer competitive pricing, and provide an extensive product catalog of 150,000+ trending items.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0E9F6E]" />
                  Simplify Shopify &amp; WooCommerce store management from one account.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0E9F6E]" />
                  Monitor profits, best-selling products, and courier analytics in real time.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0E9F6E]" />
                  Cash on Delivery across Pakistan + factory-direct sourcing from China.
                </li>
              </ul>
            </div>

            {/* Profit Estimator */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-5">
              <p className="text-xs font-bold text-[#0E9F6E]">
                Interactive Profit Estimator
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Monthly Orders</span>
                    <span className="font-mono-num">{monthlyOrders}</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={monthlyOrders}
                    onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                    className="mt-1.5 w-full accent-[#0E9F6E]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Average Margin (PKR)</span>
                    <span className="font-mono-num">PKR {avgMargin}</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={1500}
                    step={50}
                    value={avgMargin}
                    onChange={(e) => setAvgMargin(Number(e.target.value))}
                    className="mt-1.5 w-full accent-[#0E9F6E]"
                  />
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 text-center">
                  <p className="text-[11px] font-semibold text-emerald-800">
                    Estimated Monthly Earnings
                  </p>
                  <p className="font-mono-num text-2xl font-extrabold text-slate-900">
                    PKR {(monthlyOrders * avgMargin).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Features 6 cards */}
        <h2 className="mt-12 text-center font-display text-2xl font-bold text-slate-900">
          Our Features
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Package,
              title: 'One Click Inventory Management',
              desc: 'Import products, push updates, and sync stock status directly to your store.',
            },
            {
              icon: Truck,
              title: 'Hands-Off Order Tracking',
              desc: 'Automatic parcel tracking across TCS, Leopards, and PostEx synced directly.',
            },
            {
              icon: ShieldCheck,
              title: 'Hassle-Free Pre-Payments',
              desc: 'Supports both prepaid checkout and Cash on Delivery across Pakistan.',
            },
            {
              icon: BarChart3,
              title: 'One dashboard for all your analytics',
              desc: 'Instant access to sales revenue, delivery rates, and profit analytics.',
            },
            {
              icon: Wallet,
              title: 'Secure Earnings with Markaz Wallet',
              desc: 'Withdraw directly to local bank accounts, JazzCash, or Easypaisa.',
            },
            {
              icon: Layers,
              title: 'One platform, Multiple Stores',
              desc: 'Connect and manage Shopify, WooCommerce, and social catalogs together.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#0E9F6E]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-sm font-bold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Store Export Banner */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Have your own Shopify or WooCommerce store?
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Export Markaz products with your own prices as a ready-to-import CSV file.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shopify' })}
              className="rounded-full bg-[#8FE041] px-5 py-2 text-xs font-bold text-[#112A12] hover:bg-[#7ED42E]"
            >
              Sell on Shopify
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'woocommerce' })}
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
            >
              Sell on WooCommerce
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-2">
          {faqs.map((faq, idx) => (
            <div
              key={faq.q}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between text-left text-xs font-bold text-slate-900 sm:text-sm"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-[#0E9F6E]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ================= 2. RESELLER APP PAGE (Video 00:10–00:28) ================= */
export const ResellerAppPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white pb-12">
      <section className="mx-auto max-w-[1280px] px-4 pt-12 pb-10 lg:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Start your business with zero investment
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Hundreds of thousands of resellers making up to PKR 100,000 monthly across Pakistan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
                className="rounded-full border border-[#6CC320] bg-[#8FE041] px-6 py-2.5 text-xs font-bold text-[#112A12] hover:bg-[#7ED42E]"
              >
                Browse Products to Resell
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'resell' })}
                className="rounded-full border border-slate-300 px-6 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
              >
                Open Dropshipping Portal
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-6">
            <div className="w-72 rounded-[36px] border-[8px] border-slate-900 bg-white p-3 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-[10px] font-bold text-slate-700">
                <span>Markaz App</span>
                <span className="text-[#0E9F6E]">PKR Wallet</span>
              </div>
              <div className="mt-2.5 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#16A34A] p-3 text-white">
                <p className="text-[10px] uppercase opacity-85">Monthly Profit</p>
                <p className="font-mono-num text-xl font-extrabold">PKR 64,500</p>
              </div>
              <p className="mt-3 text-[11px] font-bold text-slate-800">
                Top Categories
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {CATEGORIES.slice(0, 6).map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => onNavigate({ type: 'category', slug: c.slug })}
                    className="text-center"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                      <ProductImage src={c.image} alt={c.name} className="h-full w-full" />
                    </div>
                    <p className="mt-1 truncate text-[9px] font-semibold text-slate-700">
                      {c.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Feature Cards (Quality Products, Doorstep Delivery, Higher Earnings) */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: 'Quality Products',
              desc: 'Discover over 150,000 quality products across 20+ categories at Markaz, sourced directly from top manufacturers at wholesale prices.',
              icon: Sparkles,
            },
            {
              title: 'Doorstep Delivery',
              desc: 'Markaz partners with TCS, Leopards, and PostEx for quick and efficient Cash on Delivery to your customers.',
              icon: Truck,
            },
            {
              title: 'Higher Earnings',
              desc: 'Resellers choose their preferred profit margins and receive automated JazzCash, Easypaisa, or bank payouts.',
              icon: TrendingUp,
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6"
            >
              <c.icon className="h-6 w-6 text-[#0E9F6E]" />
              <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
                {c.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Backers Banner matching video 00:17 */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#0D9488] px-6 py-5 text-white">
          <div className="flex flex-wrap items-center gap-6">
            <span className="rounded bg-white/15 px-3 py-1 font-display text-sm font-extrabold">
              Y Combinator
            </span>
            <span className="font-display text-sm font-bold tracking-wide">
              INDUS VALLEY CAPITAL
            </span>
          </div>
          <p className="font-display text-base font-bold sm:text-lg">
            Our World Class Backers
          </p>
        </div>

        {/* Reviews */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              name: 'Sadia Malik',
              quote:
                'Joining Markaz has been a life-changing experience. I started with zero investment and now earn up to PKR 100,000 monthly!',
            },
            {
              name: 'Maham Ali',
              quote:
                'Markaz allowed me to tap into the Pakistani market without any upfront cost. Support from the community is great!',
            },
            {
              name: 'Umair Khan',
              quote:
                'The delivery system is reliable and the ability to set my own profit margin makes it super flexible.',
            },
          ].map((r) => (
            <div
              key={r.name}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                &ldquo;{r.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs font-bold text-slate-900">{r.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ================= 3. SHOPIFY & WOOCOMMERCE INTEGRATION PAGES (Video 00:30–00:48) ================= */
export const StoreIntegrationPage: React.FC<{
  platform: 'shopify' | 'woocommerce';
  onNavigate: (view: AppView) => void;
}> = ({ platform, onNavigate }) => {
  const isShopify = platform === 'shopify';
  const name = isShopify ? 'Shopify' : 'WooCommerce';

  return (
    <div className="bg-white pb-12">
      {/* Dark Emerald-Indigo Hero matching video 00:30 & 00:41 */}
      <section className="mx-auto max-w-[1280px] px-4 pt-8 lg:px-6">
        <div className="rounded-3xl bg-[radial-gradient(ellipse_at_bottom_right,_#13795B_0%,_#0F4C5C_45%,_#181A63_85%,_#1B1352_100%)] p-7 text-white sm:p-10">
          <span className="inline-block rounded-full border border-[#8FE041]/40 bg-[#0A2E2E]/70 px-3 py-1 text-[11px] font-bold text-[#8FE041]">
            Free for every Markaz reseller
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Sell Markaz products on your {name} store
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200">
            Download a {name}-ready CSV of the products you choose, at the prices you set, and load it with the importer already built into {name}. Images, variants and descriptions arrive with it. No plugin, no subscription.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'export-data' })}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-900 hover:bg-emerald-50"
            >
              <span>Open the export tool</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
              className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              Browse products first
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-2.5 border-t border-white/15 pt-5 text-xs text-emerald-100 sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#8FE041]" />
              Real {name} CSV — Products → Import and you&apos;re done
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#8FE041]" />
              Products arrive as drafts so nothing goes live unreviewed
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#8FE041]" />
              Your prices, and your own brand in the Vendor field
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#8FE041]" />
              Markaz delivers across Pakistan, prepaid or Cash on Delivery
            </span>
          </div>
        </div>

        {/* 4 Steps */}
        <h2 className="mt-10 font-display text-xl font-bold text-slate-900">
          From Markaz to your {name} store
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              n: '1',
              title: 'Favourite what you want to sell',
              desc: 'Tap the heart on any Markaz product, Pakistan or China. Your favourites are the catalogue the export tool reads from.',
            },
            {
              n: '2',
              title: 'Set your prices',
              desc: 'Apply one margin across everything, or price products individually. Your store sells at your retail price.',
            },
            {
              n: '3',
              title: `Download the ${name} CSV`,
              desc: `One file shaped for ${name}'s importer with product types and tags filled in from Markaz categories.`,
            },
            {
              n: '4',
              title: 'Products → Import',
              desc: `Upload it in your ${name} admin and check "Overwrite products with matching handles".`,
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-[#0E9F6E]">
                {step.n}
              </span>
              <h3 className="mt-2.5 font-display text-sm font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 rounded-2xl bg-[radial-gradient(ellipse_at_bottom_right,_#13795B_0%,_#0F4C5C_50%,_#181A63_100%)] p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold">
            Ready to stock your {name} store?
          </h2>
          <p className="mt-1.5 text-xs text-slate-200">
            Favourite a few products on Markaz, then open the export tool and download your first CSV.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'export-data' })}
              className="rounded-full bg-[#8FE041] px-6 py-2.5 text-xs font-bold text-[#112A12] hover:bg-[#7ED42E]"
            >
              Open the export tool →
            </button>
            <button
              type="button"
              onClick={() =>
                onNavigate({ type: isShopify ? 'woocommerce' : 'shopify' })
              }
              className="rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              Selling on {isShopify ? 'WooCommerce' : 'Shopify'} instead?
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= 4. EXPORT PRODUCT DATA PAGE (Video 00:50–00:57 + Live CSV Export) ================= */
export const ExportDataPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  const [format, setFormat] = useState<'shopify' | 'woocommerce' | 'excel'>('shopify');
  const [margin, setMargin] = useState(400);
  const [exported, setExported] = useState(false);

  const handleDownload = () => {
    downloadCatalogCsv(format, margin);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="bg-white pb-12">
      <section className="mx-auto max-w-[1280px] px-4 pt-8 lg:px-6">
        <div className="rounded-3xl bg-[radial-gradient(ellipse_at_bottom_right,_#13795B_0%,_#0F4C5C_45%,_#181A63_85%,_#1B1352_100%)] p-7 text-white sm:p-10">
          <span className="inline-block rounded-full border border-[#8FE041]/40 bg-[#0A2E2E]/70 px-3 py-1 text-[11px] font-bold text-[#8FE041]">
            Product data for dropshippers
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Export Markaz product data for your dropshipping store
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200">
            Get a clean product file — names, descriptions, images, variants, prices and SKUs — for the Markaz products you choose. Import it into Shopify or WooCommerce, or open it in Excel.
          </p>

          {/* Live Export Controls */}
          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-emerald-100">
                  Target File Format
                </label>
                <select
                  value={format}
                  onChange={(e) =>
                    setFormat(e.target.value as 'shopify' | 'woocommerce' | 'excel')
                  }
                  className="h-10 w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 text-xs font-semibold text-white focus:border-[#8FE041] focus:outline-none"
                >
                  <option value="shopify">Shopify CSV (Drafts Ready)</option>
                  <option value="woocommerce">WooCommerce CSV</option>
                  <option value="excel">Plain Excel / Spreadsheet CSV</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-emerald-100">
                  Profit Margin Added (PKR)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={margin}
                  onChange={(e) => setMargin(Math.max(0, Number(e.target.value) || 0))}
                  className="font-mono-num h-10 w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 text-xs font-bold text-white focus:border-[#8FE041] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#8FE041] px-5 text-xs font-bold text-[#112A12] shadow-md hover:bg-[#7ED42E]"
              >
                {exported ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Downloaded CSV!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Generate &amp; Download CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* How the export works */}
        <h2 className="mt-10 font-display text-xl font-bold text-slate-900">
          How the export works
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              n: '1',
              title: 'Build your list or use Markaz Top Sellers',
              desc: 'Select any format above — Shopify CSV, WooCommerce CSV, or plain Excel spreadsheet.',
            },
            {
              n: '2',
              title: 'Price the products',
              desc: 'Set your PKR margin on top of Markaz wholesale prices automatically.',
            },
            {
              n: '3',
              title: 'Choose your format',
              desc: 'Shopify and WooCommerce CSVs match native store columns out of the box.',
            },
            {
              n: '4',
              title: 'Import, or work with the data',
              desc: 'Upload directly to your store admin or edit in Excel and Google Sheets.',
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-[#0E9F6E]">
                  {s.n}
                </span>
                <h3 className="font-display text-sm font-bold text-slate-900">
                  {s.title}
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-6 w-6 text-[#0E9F6E]" />
            <div>
              <p className="text-sm font-bold text-slate-900">
                Includes {PRODUCTS.length} verified Markaz products &amp; SKUs
              </p>
              <p className="text-xs text-slate-500">
                Prices in PKR · Stock counts included · China rows marked
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Browse Full Catalog</span>
          </button>
        </div>
      </section>
    </div>
  );
};
