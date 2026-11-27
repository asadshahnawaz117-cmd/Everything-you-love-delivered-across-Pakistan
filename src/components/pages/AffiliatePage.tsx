import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Globe,
  Heart,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Tag,
  TrendingUp,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { PRODUCTS, SHOP_CATEGORY_TILES, STUDIO_IMAGES } from '../../data/catalog';
import { AppView, Product, ProductColorVariant } from '../../types';
import { MarkazLogo } from '../MarkazLogo';
import { ProductImage } from '../ProductCard';

interface AffiliatePageProps {
  onNavigate: (view: AppView) => void;
  onQuickAdd?: (product: Product, color?: ProductColorVariant) => void;
}

const AFFILIATE_FAQS = [
  {
    q: 'Is it free to join the Markaz Affiliate Program?',
    a: 'Yes! Joining the Markaz Affiliate Program is 100% free with zero registration fees, subscriptions, or minimum follower requirements.',
  },
  {
    q: 'Do I need a website or a big following?',
    a: 'No website is needed. Share your unique referral code or product links on WhatsApp statuses, Facebook groups, TikTok, or Instagram Reels.',
  },
  {
    q: 'How do I earn as a Markaz Affiliate?',
    a: 'Earn through three streams: Cash Rewards for approved video/story content, passive commission on every customer order placed with your discount code, and Product Vouchers redeemable in the Markaz app.',
  },
  {
    q: 'How and when do I get paid?',
    a: 'Commissions and approved task rewards are paid out in PKR straight to your JazzCash, Easypaisa, or bank account once orders are delivered.',
  },
  {
    q: "What's the difference between the affiliate and reseller programs?",
    a: 'Affiliates share discount codes and earn commission/rewards without taking orders manually. Resellers set custom profit margins on each item and manage customer COD orders via the Dropshipping Portal or Markaz App.',
  },
  {
    q: 'Why will my audience actually buy from Markaz?',
    a: 'Because Markaz offers Cash on Delivery nationwide, 7-day easy returns, no minimum order, and factory-direct prices from verified Pakistani and Chinese sellers.',
  },
];

export const AffiliatePage: React.FC<AffiliatePageProps> = ({
  onNavigate,
  onQuickAdd = () => {},
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authJoined, setAuthJoined] = useState(false);
  const [monthlyPosts, setMonthlyPosts] = useState(12);
  const [ordersPerWeek, setOrdersPerWeek] = useState(18);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const estimatedAffiliateMonthly =
    monthlyPosts * 350 + ordersPerWeek * 4 * 240;

  const handleCopyPromo = (id: string, title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`https://markaz.app/ref/ASAD10?item=${encodeURIComponent(title)}`)
        .catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthJoined(true);
  };

  return (
    <div className="bg-white pb-12">
      {/* 1. Hero (Matches video 02:42 & 03:15) */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom_right,_#13795B_0%,_#0F4C5C_45%,_#181A63_82%,_#1B1352_100%)] text-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-4 py-12 lg:grid-cols-12 lg:px-6 lg:py-16">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22C55E]/45 bg-[#0A2E2E]/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#84E14B]">
              <Sparkles className="h-3 w-3" />
              MARKAZ AFFILIATE PROGRAM
            </span>

            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              Earn in PKR by sharing{' '}
              <span className="text-[#84E14B]">products Pakistan loves 💚</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200/95">
              Pakistan&apos;s cash-on-delivery marketplace pays you to refer shoppers. Share your code and content, earn cash, commission and product vouchers — no website, no inventory, no investment.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-slate-100 sm:text-sm">
              <li className="flex items-center gap-2">
                <span className="text-base">💸</span>
                <span>Cash rewards for every approved task</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">🛍️</span>
                <span>Commission on every order via your discount code</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">🎁</span>
                <span>Redeem points for free product vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">📦</span>
                <span>No inventory, no delivery hassle — Markaz handles it</span>
              </li>
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#6CC320] bg-[#8FE041] px-6 py-3 text-xs font-bold text-[#112A12] shadow-md transition-colors hover:bg-[#7ED42E]"
              >
                <span>Start earning — it&apos;s free</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-xs font-bold text-white backdrop-blur-xs hover:bg-white/20"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Right Visual Collage + Glowing Heart Card */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="relative flex w-full max-w-md flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/8 p-5 backdrop-blur-md">
              <div className="grid w-full grid-cols-2 gap-2.5">
                {[
                  { label: 'Lawn Suits · +PKR 320/order', img: STUDIO_IMAGES.lawnEmerald },
                  { label: 'Smartwatches · +PKR 280/order', img: STUDIO_IMAGES.chronoWatch },
                  { label: 'Serums & Beauty · +PKR 250/order', img: STUDIO_IMAGES.serumKit },
                  { label: 'Mini Projectors · +PKR 550/order', img: STUDIO_IMAGES.projector },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/20 bg-slate-900"
                  >
                    <img
                      src={card.img}
                      alt={card.label}
                      className="h-full w-full object-cover opacity-90"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2 py-1.5 text-[10px] font-bold text-white">
                      {card.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/20 bg-[#082032] px-4 py-2.5 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4ADE80]/20">
                    <Heart className="h-5 w-5 fill-[#5EE02A] text-[#5EE02A]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Share &amp; Earn PKR</p>
                    <p className="text-[10px] text-emerald-300">Instant Promo Code Tracking</p>
                  </div>
                </div>
                <span className="rounded-lg bg-[#8FE041] px-2.5 py-1 text-[10px] font-extrabold text-[#112A12]">
                  FREE TO JOIN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lime Strip Ticker */}
        <div className="bg-[#7ED934] px-4 py-2 text-center text-[11px] font-extrabold uppercase tracking-wider text-[#0F2A10]">
          💚 FREE TO JOIN &nbsp;·&nbsp; 🌐 NO WEBSITE NEEDED &nbsp;·&nbsp; 💵 PAID IN PKR &nbsp;·&nbsp; 💸 CASH REWARDS &nbsp;·&nbsp; 🛍️ COMMISSION ON EVERY ORDER &nbsp;·&nbsp; 🎁 FREE PRODUCT VOUCHERS
        </div>
      </section>

      {/* 2. Who it's for */}
      <section className="mx-auto max-w-[1280px] px-4 pt-12 lg:px-6">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Who it&apos;s for 🙌
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            If you can share a link or make a post, you can earn with Markaz.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: '🎬',
              title: 'Creators & influencers',
              desc: 'Turn followers into income with your code and content — no 100k following required.',
            },
            {
              icon: '🛍️',
              title: 'Resellers & shopkeepers',
              desc: 'Already sell to customers? Earn extra by referring them to Markaz deals.',
            },
            {
              icon: '🎓',
              title: 'Students & home earners',
              desc: 'Earn from your phone in your spare time — free to join, no investment.',
            },
            {
              icon: '💬',
              title: 'WhatsApp & Facebook sellers',
              desc: 'Share products in your groups and chats and earn on every order.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-lg">
                {item.icon}
              </span>
              <h3 className="mt-3 font-display text-sm font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How it works */}
      <section className="mx-auto max-w-[1280px] px-4 pt-12 lg:px-6">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            How it works ⚡
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Three simple steps to start earning
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Apply',
              desc: 'Fill out the quick application form. Tell us about your platform and audience.',
            },
            {
              step: '2',
              title: 'Get approved',
              desc: 'Our team reviews within 2–3 business days and sends your unique discount code.',
            },
            {
              step: '3',
              title: 'Start earning',
              desc: 'Complete tasks, share your code, earn cash and points — withdraw anytime.',
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 text-center"
            >
              <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#0E9F6E] text-xs font-bold text-white">
                {s.step}
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-slate-900">
                {s.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Three ways to earn (Vivid gradient cards from video 02:49) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-12 lg:px-6">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Three ways to earn 🤑
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Stack your income with every post you make
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#10B981] p-6 text-white shadow-lg">
            <div>
              <span className="text-2xl">💸</span>
              <h3 className="mt-3 font-display text-lg font-bold">Cash Rewards</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-emerald-50">
                Earn cash for every approved content submission — unboxing videos, reviews, story shoutouts, and more.
              </p>
            </div>
            <span className="mt-5 inline-block self-start rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold">
              Up to Rs. 500 per task
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#5B21B6] to-[#3B82F6] p-6 text-white shadow-lg">
            <div>
              <span className="text-2xl">🏷️</span>
              <h3 className="mt-3 font-display text-lg font-bold">
                Discount Code Commission
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-indigo-100">
                Your personal discount code earns you a commission every time a customer uses it at checkout.
              </p>
            </div>
            <span className="mt-5 inline-block self-start rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold">
              Passive income on every order
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#BE123C] to-[#F43F5E] p-6 text-white shadow-lg">
            <div>
              <span className="text-2xl">🎁</span>
              <h3 className="mt-3 font-display text-lg font-bold">
                Product Vouchers
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-rose-100">
                Accumulate points from approved posts and redeem them for free product vouchers on the Markaz app.
              </p>
            </div>
            <span className="mt-5 inline-block self-start rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold">
              100 pts = Rs. 1,000 voucher
            </span>
          </div>
        </div>
      </section>

      {/* 5. Why your referrals actually convert (Dark Navy Band matching video 02:50) */}
      <section className="mt-12 bg-[#07152D] py-12 text-white">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold">
              Why your referrals actually convert 🔥
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Markaz makes the sale easy — so the people you refer actually buy.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Truck,
                title: 'Cash on delivery',
                desc: 'Pay on arrival in PKR — the payment method Pakistani buyers trust most.',
              },
              {
                icon: RotateCcw,
                title: '7-day returns',
                desc: 'Buyer protection on every order builds instant confidence.',
              },
              {
                icon: Tag,
                title: 'Factory & best prices',
                desc: 'Direct-from-source pricing your audience won’t find cheaper.',
              },
              {
                icon: Store,
                title: 'No minimum order',
                desc: 'Followers can buy a single product — no bulk needed.',
              },
              {
                icon: ShieldCheck,
                title: 'Trusted Pakistani sellers',
                desc: 'A curated marketplace, not random shops.',
              },
              {
                icon: Globe,
                title: 'China, handled',
                desc: 'Factory-direct from China in 10–17 days — they pay in rupees with no customs hassle.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <card.icon className="h-5 w-5 text-[#84E14B]" />
                <h3 className="mt-3 font-display text-sm font-bold text-white">
                  {card.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Creator Testimonials with Studio Product Photos */}
      <section className="mx-auto max-w-[1280px] px-4 pt-12 lg:px-6">
        <h2 className="text-center font-display text-2xl font-bold text-slate-900">
          What affiliates say 💚
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: 'Sara A.',
              handle: '@sara_pk',
              img: STUDIO_IMAGES.festivePeach,
              quote:
                'I made Rs. 18,500 in my first month just sharing products I already use. Super easy!',
            },
            {
              name: 'Ali K.',
              handle: '@alik_creates',
              img: STUDIO_IMAGES.chronoWatch,
              quote:
                'The discount code commission is amazing. My followers love the deals and I earn every time.',
            },
            {
              name: 'Hira M.',
              handle: '@hiraslifestyle',
              img: STUDIO_IMAGES.cosmetics,
              quote:
                'Markaz affiliate is the most transparent program I’ve joined. Payouts are always on time.',
            },
            {
              name: 'Usman T.',
              handle: '@usman_tech',
              img: STUDIO_IMAGES.earbuds,
              quote:
                'Really good for micro-influencers. You don’t need 100k followers to start earning.',
            },
          ].map((rev) => (
            <div
              key={rev.name}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img src={rev.img} alt={rev.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                  &ldquo;{rev.quote}&rdquo;
                </p>
                <p className="mt-3 text-xs font-bold text-slate-900">{rev.name}</p>
                <p className="text-[11px] text-slate-400">{rev.handle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Affiliate Payout Calculator */}
        <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Calculate your monthly affiliate income
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Combine cash content tasks with passive discount-code commissions across 150,000+ Markaz items.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Posts / month</span>
                  <span className="font-mono-num">{monthlyPosts}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={40}
                  value={monthlyPosts}
                  onChange={(e) => setMonthlyPosts(Number(e.target.value))}
                  className="mt-2 w-full accent-[#0E9F6E]"
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Orders / week</span>
                  <span className="font-mono-num">{ordersPerWeek}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={100}
                  value={ordersPerWeek}
                  onChange={(e) => setOrdersPerWeek(Number(e.target.value))}
                  className="mt-2 w-full accent-[#0E9F6E]"
                />
              </div>
              <div className="rounded-xl bg-[#0F766E] p-4 text-center text-white">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100">
                  Est. Monthly Payout
                </p>
                <p className="font-mono-num mt-1 text-xl font-extrabold">
                  PKR {estimatedAffiliateMonthly.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Commission Products to Promote (24 items with Copy Link & Quick Add) */}
        <div className="mt-12">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Top Commission Products to Promote
              </h2>
              <p className="text-xs text-slate-500">
                Copy any product referral link or click to inspect photos &amp; customer reviews.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
              className="text-xs font-semibold text-[#0E9F6E] hover:underline"
            >
              Browse full catalog →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {PRODUCTS.slice(0, 24).map((p) => {
              const estComm = Math.round(p.price * 0.12);
              const isCopied = copiedId === p.id;
              return (
                <div
                  key={`aff-prod-${p.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => onNavigate({ type: 'product', productId: p.id })}
                    className="relative aspect-[4/3] overflow-hidden bg-slate-100 text-left"
                  >
                    <ProductImage
                      src={p.images[0]}
                      alt={p.title}
                      className="h-full w-full object-cover group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 rounded bg-[#0E9F6E] px-2 py-0.5 text-[10px] font-bold text-white">
                      Earn +PKR {estComm}
                    </span>
                  </button>
                  <div className="flex flex-1 flex-col p-3">
                    <button
                      type="button"
                      onClick={() => onNavigate({ type: 'product', productId: p.id })}
                      className="text-left text-xs font-semibold text-slate-800 line-clamp-2 hover:text-[#0E9F6E]"
                    >
                      {p.title}
                    </button>
                    <p className="font-mono-num mt-1 text-xs font-bold text-slate-900">
                      PKR {p.price.toLocaleString()}
                    </p>
                    <div className="mt-auto grid grid-cols-2 gap-1.5 pt-2.5">
                      <button
                        type="button"
                        onClick={() => handleCopyPromo(p.id, p.title)}
                        className="inline-flex h-7 items-center justify-center gap-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 hover:border-[#0E9F6E] hover:text-[#0E9F6E]"
                      >
                        {isCopied ? <Check className="h-3 w-3 text-[#0E9F6E]" /> : <Copy className="h-3 w-3" />}
                        <span>{isCopied ? 'Copied' : 'Link'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuickAdd(p)}
                        className="h-7 rounded-lg bg-[#0E9F6E] text-[10px] font-bold text-white hover:bg-[#057A55]"
                      >
                        Sample
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 18 Categories Showcase */}
        <div className="mt-12">
          <h3 className="mb-4 font-display text-lg font-bold text-slate-900">
            18 High-Converting Categories
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
            {SHOP_CATEGORY_TILES.map((tile) => (
              <button
                key={`aff-cat-${tile.label}`}
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

        {/* Comparison */}
        <div className="mt-12">
          <h2 className="text-center font-display text-2xl font-bold text-slate-900">
            Affiliate or reseller — which is for you? 🤔
          </h2>
          <p className="mt-1 text-center text-xs text-slate-500">
            Two free ways to earn from home with Markaz. Pick one, or do both.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-[#0E9F6E] bg-emerald-50/40 p-6">
              <span className="inline-block rounded bg-[#0E9F6E] px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                YOU&apos;RE HERE
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
                Affiliate
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#0E9F6E]" />
                  Share your code &amp; content
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#0E9F6E]" />
                  Earn cash + commission on orders
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#0E9F6E]" />
                  Best if you already have an audience
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="inline-block rounded bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                SIBLING PROGRAM
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
                Reseller / Dropshipping
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#0E9F6E]" />
                  Sell products at your own margin
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#0E9F6E]" />
                  Markaz handles delivery &amp; COD
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#0E9F6E]" />
                  Best if you want your own store
                </li>
              </ul>
              <button
                type="button"
                onClick={() => onNavigate({ type: 'resell' })}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <span>Explore reselling</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ & Ready to start CTA */}
      <section className="mx-auto max-w-[1280px] px-4 pt-12 lg:px-6">
        <h2 className="text-center font-display text-2xl font-bold text-slate-900">
          Frequently asked questions 💬
        </h2>
        <div className="mx-auto mt-6 max-w-3xl space-y-2.5">
          {AFFILIATE_FAQS.map((faq, idx) => {
            const open = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3.5"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : idx)}
                  className="flex w-full items-center justify-between gap-3 text-left text-xs font-semibold text-slate-900 sm:text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      open ? 'rotate-180 text-[#0E9F6E]' : ''
                    }`}
                  />
                </button>
                {open && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Ready to start earning gradient box (Matches video 02:58) */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#0F766E] to-[#16A34A] px-6 py-10 text-center text-white">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Ready to start earning? 🌱
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-emerald-50 sm:text-sm">
            Join the Markaz Affiliate Program today. Free to join, no inventory required.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-full bg-[#8FE041] px-6 py-2.5 text-xs font-bold text-[#112A12] hover:bg-[#7ED42E]"
            >
              Start earning — it&apos;s free →
            </button>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-full border border-white/30 bg-slate-900/35 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-900/55"
            >
              Already a member? Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Affiliate Get Started / Sign In Modal (Matches video 03:00) */}
      {authModalOpen && (
        <div
          onClick={() => setAuthModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-label="Markaz Affiliate Sign In"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex justify-center">
              <MarkazLogo size="sm" />
            </div>

            {authJoined ? (
              <div className="mt-5 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#0E9F6E]">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Affiliate Request Sent
                </h3>
                <p className="text-xs text-slate-500">
                  We&apos;ve registered <span className="font-semibold text-slate-800">{authEmail || 'your account'}</span> for the Markaz Affiliate Program. Your promo code will arrive within 2–3 business days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalOpen(false);
                    setAuthJoined(false);
                  }}
                  className="mt-2 h-10 w-full rounded-xl bg-[#0E9F6E] text-xs font-bold text-white hover:bg-[#057A55]"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">
                  Get Started
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Welcome to the Markaz Affiliate Program.
                </p>

                <form onSubmit={handleJoinSubmit} className="mt-5 space-y-3 text-left">
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-10 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-[#0E9F6E] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50"
                  >
                    <Users className="h-4 w-4 text-[#0E9F6E]" />
                    <span>Continue with Email / Google</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
