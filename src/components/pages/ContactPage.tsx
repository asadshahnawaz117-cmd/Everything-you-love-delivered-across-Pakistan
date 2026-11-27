import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  FAQS,
  HERO_DELIVERY_IMAGE,
  PRODUCTS,
  SHOP_CATEGORY_TILES,
  STUDIO_IMAGES,
} from '../../data/catalog';
import { saveContactMessageToSupabase } from '../../lib/supabase/client';
import { AppView, Product, ProductColorVariant } from '../../types';
import { ProductCard, ProductImage } from '../ProductCard';

interface ContactPageProps {
  onNavigate: (view: AppView) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (id: string) => void;
  onQuickAdd?: (product: Product, color?: ProductColorVariant) => void;
}

interface SupportTicket {
  id: string;
  email: string;
  message: string;
  createdAt: string;
}

const OFFICE_HUBS = [
  {
    city: 'Islamabad HQ',
    address: 'Street No. 34, Sector G-9/1, Islamabad, Pakistan',
    hours: 'Mon–Sat · 9:00 AM – 8:00 PM PKT',
    phone: '+92 302 2222277',
    img: HERO_DELIVERY_IMAGE,
  },
  {
    city: 'Lahore Fulfillment Hub',
    address: 'Block K, Gulberg III Dispatch Center, Lahore',
    hours: 'Mon–Sat · 9:00 AM – 9:00 PM PKT',
    phone: '+92 302 2222277',
    img: STUDIO_IMAGES.lawnEmerald,
  },
  {
    city: 'Karachi Port & Sorting Center',
    address: 'SITE Industrial Area & Shahrah-e-Faisal Hub, Karachi',
    hours: 'Mon–Sat · 9:00 AM – 9:00 PM PKT',
    phone: '+92 302 2222277',
    img: STUDIO_IMAGES.projector,
  },
  {
    city: 'United States Corporate Office',
    address: '2510 North Church Street, Wilmington, DE 19802, USA',
    hours: 'Mon–Fri · 9:00 AM – 6:00 PM EST',
    phone: '+1 302 8030860',
    img: STUDIO_IMAGES.books,
  },
];

const CONTENT_KITS = [
  {
    title: 'Festive Lawn & Apparel Reels Pack',
    desc: 'High-res studio photos and pricing captions ready for WhatsApp & Instagram.',
    img: STUDIO_IMAGES.festivePeach,
    slug: 'womens-stitched' as const,
  },
  {
    title: 'China Gadgets & Smart Tech Kit',
    desc: 'Spec sheets, factory-direct comparisons, and 30-second product clips.',
    img: STUDIO_IMAGES.smartwatch,
    slug: 'electronics' as const,
  },
  {
    title: 'Bridal Beauty & Skincare Guide',
    desc: 'Shade swatches and bundle checklists for beauty resellers.',
    img: STUDIO_IMAGES.cosmetics,
    slug: 'cosmetics' as const,
  },
  {
    title: 'Kitchen & Home Upgrade Catalog',
    desc: 'Ready-to-post home organizer and cookware lifestyle galleries.',
    img: STUDIO_IMAGES.airFryer,
    slug: 'kitchenware' as const,
  },
  {
    title: 'Watches & Men’s Accessories Lookbook',
    desc: 'High-margin gift sets with verified COD dispatch badges.',
    img: STUDIO_IMAGES.chronoWatch,
    slug: 'watches-jewellery' as const,
  },
  {
    title: 'Bedding & Velvet Room Collection',
    desc: '4-piece bridal bedding photos and room styling guides.',
    img: STUDIO_IMAGES.beddingMaroon,
    slug: 'bedding' as const,
  },
];

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  wishlistIds = [],
  onToggleWishlist = () => {},
  onQuickAdd = () => {},
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [kitDownloaded, setKitDownloaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    const cleanEmail = email.trim();
    const cleanMsg = message.trim();
    const newTicket: SupportTicket = {
      id: `MKZ-${Math.floor(10000 + Math.random() * 90000)}`,
      email: cleanEmail,
      message: cleanMsg,
      createdAt: 'Just now',
    };
    setTickets((prev) => [newTicket, ...prev]);
    void saveContactMessageToSupabase(cleanEmail, cleanMsg);
    setPassword('');
    setMessage('');
  };

  const downloadMediaPackCsv = () => {
    const header = 'Category,Product Title,SKU,Price PKR,City,Image URL\n';
    const rows = PRODUCTS.slice(0, 30)
      .map(
        (p) =>
          `"${p.categoryLabel}","${p.title.replace(/"/g, '""')}","${p.sku}",${p.price},"${p.supplierCity}","${p.images[0]}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markaz-content-media-pack.csv';
    a.click();
    URL.revokeObjectURL(url);
    setKitDownloaded(true);
    setTimeout(() => setKitDownloaded(false), 3000);
  };

  return (
    <div className="bg-white pb-16">
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#092319] via-[#0B3B2A] to-[#0E9F6E] text-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-4 py-12 lg:grid-cols-12 lg:px-6 lg:py-16">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-white/10 px-3.5 py-1 text-xs font-semibold text-emerald-100">
              <Headphones className="h-3.5 w-3.5 text-emerald-300" />
              <span>24/7 Reseller &amp; Buyer Support · Content &amp; Media Desk</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
              Contact Markaz &amp; Content Hub
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
              Need help with a Cash on Delivery parcel, reseller profit payout, supplier onboarding, or ready-to-share product content? Reach our Islamabad, Lahore &amp; Karachi teams anytime.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs">
                <Phone className="h-4 w-4 text-emerald-300" />
                <p className="mt-2 text-xs font-medium text-emerald-100">Pakistan Helpline</p>
                <p className="font-mono-num mt-0.5 text-sm font-bold text-white">+92 302 2222277</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs">
                <Mail className="h-4 w-4 text-emerald-300" />
                <p className="mt-2 text-xs font-medium text-emerald-100">Support &amp; Press</p>
                <p className="mt-0.5 text-sm font-bold text-white">hello@markaz.app</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs">
                <Clock className="h-4 w-4 text-emerald-300" />
                <p className="mt-2 text-xs font-medium text-emerald-100">Average Reply Time</p>
                <p className="mt-0.5 text-sm font-bold text-white">Under 2 Hours</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-5">
            {[
              { img: HERO_DELIVERY_IMAGE, label: 'Express Dispatch' },
              { img: STUDIO_IMAGES.lawnEmerald, label: 'Branded Collections' },
              { img: STUDIO_IMAGES.chronoWatch, label: 'Verified Quality' },
              { img: STUDIO_IMAGES.cosmetics, label: 'Creator Assets' },
            ].map((card) => (
              <div
                key={card.label}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 bg-black/20"
              >
                <ProductImage
                  src={card.img}
                  alt={card.label}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2 text-[11px] font-semibold text-white">
                  {card.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Support Ticket Form + Topic Selector */}
      <section className="mx-auto max-w-[1280px] px-4 pt-12 lg:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 lg:col-span-7">
            <div className="flex items-center gap-2 text-[#0E9F6E]">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                Send a message to our team
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Enter your email, password, and message below to contact our team.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm focus:border-[#0E9F6E] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm focus:border-[#0E9F6E] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm focus:border-[#0E9F6E] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0E9F6E] px-6 text-sm font-bold text-white transition-colors hover:bg-[#057A55]"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </form>

            {tickets.length > 0 && (
              <div className="mt-6 space-y-2.5 border-t border-slate-200 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Messages Received ({tickets.length})
                </p>
                {tickets.map((tk) => (
                  <div
                    key={tk.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs"
                  >
                    <div>
                      <span className="font-mono-num font-bold text-slate-900">{tk.id}</span>
                      <span className="mx-2 text-slate-400">·</span>
                      <span className="font-semibold text-emerald-800">{tk.email}</span>
                      <p className="mt-0.5 text-slate-700">{tk.message}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-semibold text-[#0E9F6E]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Delivered ({tk.createdAt})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Office Hubs */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#0E9F6E]" />
              <h2 className="font-display text-xl font-bold text-slate-900">
                Offices &amp; Logistics Hubs
              </h2>
            </div>

            {OFFICE_HUBS.map((hub) => (
              <div
                key={hub.city}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs"
              >
                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <ProductImage
                    src={hub.img}
                    alt={hub.city}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm font-bold text-slate-900">{hub.city}</h3>
                  <p className="mt-0.5 flex items-start gap-1 text-xs text-slate-600">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0E9F6E]" />
                    <span>{hub.address}</span>
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    {hub.hours} · <span className="font-mono-num text-slate-700">{hub.phone}</span>
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0E9F6E]" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    7-Day Return &amp; Replacement Protection
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Have an issue with an order? Track your shipment or request a pickup from Order History.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate({ type: 'orders' })}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#0E9F6E] hover:underline"
                  >
                    <span>Go to Order History</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Creator Content Packs & Reseller Media Assets */}
      <section className="mx-auto max-w-[1280px] px-4 pt-14 lg:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0E9F6E]">
              <Sparkles className="h-3.5 w-3.5" />
              RESELLER CONTENT CENTER
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">
              Ready-to-Share Product Content Packs
            </h2>
          </div>
          <button
            type="button"
            onClick={downloadMediaPackCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-900 hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
          >
            <Download className="h-4 w-4 text-[#0E9F6E]" />
            <span>{kitDownloaded ? 'Downloaded CSV!' : 'Download Product Content CSV'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTENT_KITS.map((kit) => (
            <button
              key={kit.title}
              type="button"
              onClick={() => onNavigate({ type: 'category', slug: kit.slug })}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-[#0E9F6E] hover:shadow-md"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <ProductImage
                  src={kit.img}
                  alt={kit.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-slate-900 group-hover:text-[#0E9F6E]">
                  {kit.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{kit.desc}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#0E9F6E]">
                  Open category assets <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Interactive FAQ Accordion */}
      <section className="mx-auto max-w-[1280px] px-4 pt-12 lg:px-6">
        <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
          Frequently asked support questions
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={`contact-faq-${faq.q}`}
                className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
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
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{faq.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Top Selling Products & 18 Categories Showcase (+42 images) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-12 lg:px-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Featured Marketplace Products
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="text-xs font-semibold text-[#0E9F6E] hover:underline"
          >
            Browse full shop →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {PRODUCTS.slice(12, 36).map((p, idx) => (
            <ProductCard
              key={`cnt-prod-${p.id}`}
              product={p}
              staggerIndex={idx}
              isWishlisted={wishlistIds.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={(prod) => onNavigate({ type: 'product', productId: prod.id })}
            />
          ))}
        </div>

        <h3 className="mt-10 mb-4 font-display text-lg font-bold text-slate-900">
          Browse all 18 categories
        </h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
          {SHOP_CATEGORY_TILES.map((tile) => (
            <button
              key={`cnt-cat-${tile.label}`}
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
