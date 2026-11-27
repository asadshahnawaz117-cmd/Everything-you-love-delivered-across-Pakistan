import React, { useState } from 'react';
import { CheckCircle2, Eye, HelpCircle, Mail, Phone, Send, Target } from 'lucide-react';
import { AppView, Product, ProductColorVariant } from '../../types';
import {
  HERO_DELIVERY_IMAGE,
  PRODUCTS,
  SHOP_CATEGORY_TILES,
  STUDIO_IMAGES,
} from '../../data/catalog';
import { ProductCard, ProductImage } from '../ProductCard';

interface AboutPageProps {
  onNavigate: (view: AppView) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (id: string) => void;
  onQuickAdd?: (product: Product, color?: ProductColorVariant) => void;
}

const VALUES = [
  {
    title: 'Push boundaries',
    body: 'We strive to be the best at everything we do and aim for the stars with humility. We never back down and strive to improve upon even the best possible outcomes.',
    bullets: [
      'We are fearless',
      'We challenge the status quo and ask why',
      "We don't hesitate to experiment and encourage people to try, fail, fast and learn",
    ],
    img: '/src/assets/images/product_smartwatch_black_1795763312031.jpg',
  },
  {
    title: 'Have Bias for Action',
    body: 'Action is the key to removing inertia and changing outcomes. We don’t shy away from making tough decisions, believe in empowering each other, and differentiate between one-way and two-way door decisions.',
    bullets: [
      'We think big but start small',
      'We believe in making the wrong decisions and learning along the way rather than being indecisive',
      'We end every meeting with concrete actions and leave no space for ambiguity',
    ],
    img: '/src/assets/images/product_bestselling_books_1795763315995.jpg',
  },
  {
    title: 'Be Curious',
    body: 'Curiosity is essential to problem-solving; we encourage questioning everything from a first-principles perspective to understand the depth of a problem.',
    bullets: [
      'There are no stupid questions',
      'Always ask questions, even if you ask yourselves',
      'We encourage learning from everyone around us to improve your thought process and build a path to continuous learning',
    ],
    img: '/src/assets/images/product_china_electronics_1795762083168.jpg',
  },
  {
    title: 'Empathy Above All',
    body: 'We are working in a space where building trust is essential. It’s important to understand the plight of our customers from their perspective to understand their core problems and present the most optimal solution.',
    bullets: [
      'We bring the voice of our customers into every discussion',
      'We listen more and speak less',
      'We prioritize patience and curiosity before our own opinions',
    ],
    img: '/src/assets/images/product_womens_lawn_1795762080335.jpg',
  },
  {
    title: 'Communicate Candidly',
    body: 'All of us bring diverse perspectives and experiences to the table. We believe in over-communicating for effective collaboration to highlight our strengths as a collective.',
    bullets: [
      'We receive and give feedback with humility',
      'We are documentation obsessed — we document discussions, experiments, and decisions to exercise transparency',
      'We over-communicate when others depend on us',
      'In moments of doubt, we waste no time and connect immediately for clarity',
    ],
    img: '/src/assets/images/product_earbuds_white_case_1795763837996.jpg',
  },
  {
    title: 'Improve Every Day',
    body: 'We believe that perfection in execution is achievable but at the same time extremely difficult. The most important aspect of achieving thirst for perfection is to value continuous improvement. We become analytical in every aspect of the operations of the company, build knowledge pools, and improve every day.',
    bullets: [
      'We strive to become the best',
      'We look at data honestly to comprehend',
      'We build best practices and frameworks to implement them across the board',
      'We know that 1% improvement every day leads to world-changing impact',
    ],
    img: HERO_DELIVERY_IMAGE,
  },
];

const CULTURE_GALLERY = [
  { label: 'Team Townhall', img: STUDIO_IMAGES.books },
  { label: 'Operations Hub', img: HERO_DELIVERY_IMAGE },
  { label: 'Seller Workshop', img: STUDIO_IMAGES.lawnEmerald },
  { label: 'Quality Lab', img: STUDIO_IMAGES.cookware },
  { label: 'Islamabad HQ', img: STUDIO_IMAGES.chronoWatch },
  { label: 'Product Studio', img: STUDIO_IMAGES.cosmetics },
  { label: 'Growth Retreat', img: STUDIO_IMAGES.oudBox },
  { label: 'Logistics Team', img: STUDIO_IMAGES.shoesWhite },
  { label: 'Fashion Curation', img: STUDIO_IMAGES.festivePeach },
  { label: 'China Sourcing Desk', img: STUDIO_IMAGES.projector },
  { label: 'Kitchen Testing', img: STUDIO_IMAGES.airFryer },
  { label: 'Apparel Studio', img: STUDIO_IMAGES.mensKurta },
  { label: 'Packaging Standards', img: STUDIO_IMAGES.teaSet },
  { label: 'Home & Decor Edit', img: STUDIO_IMAGES.wallDecor },
  { label: 'Reseller Community', img: STUDIO_IMAGES.bag },
  { label: 'Express Dispatch', img: STUDIO_IMAGES.homeOrganizer },
];

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  wishlistIds = [],
  onToggleWishlist = () => {},
  onQuickAdd = () => {},
}) => {
  const [contactSent, setContactSent] = useState(false);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-4 pt-12 pb-10 lg:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Supercharging rails of E-commerce
            </h1>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#0E9F6E]">
                  <Target className="h-5 w-5" />
                </div>
                <h2 className="mt-3 font-display text-lg font-bold text-slate-900">
                  Mission
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  To enable every Pakistani to start an online business with zero investment.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#0E9F6E]">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="mt-3 font-display text-lg font-bold text-slate-900">
                  Vision
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  To build a Pakistan where entrepreneurship is easy and e-commerce is accessible to the masses.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg aspect-[16/10]">
              <img
                src={HERO_DELIVERY_IMAGE}
                alt="Markaz Operations across Pakistan"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0B1F3A]/45 via-transparent to-emerald-500/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mx-auto max-w-[1280px] px-4 py-12 lg:px-6">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Our Values
          </h2>
        </div>

        <div className="mt-12 space-y-16">
          {VALUES.map((val, idx) => {
            const imageFirst = idx % 2 === 0;
            return (
              <div
                key={val.title}
                className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12"
              >
                <div
                  className={`relative ${
                    imageFirst ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5 lg:order-2'
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-4 rounded-3xl bg-emerald-300/25 blur-2xl"
                  />
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md aspect-[16/10]">
                    <img
                      src={val.img}
                      alt={val.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div
                  className={`${
                    imageFirst ? 'lg:col-span-7 lg:order-2 lg:pl-8' : 'lg:col-span-7 lg:order-1 lg:pr-8'
                  }`}
                >
                  <h3 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                    {val.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {val.body}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {val.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-xs text-slate-700 sm:text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0E9F6E]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Markaz */}
      <section className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            Contact Markaz
          </h2>
          <p className="mx-auto mt-1.5 max-w-xl text-xs text-slate-500 sm:text-sm">
            Questions about an order, reselling, or working with Markaz? Call the helpline, email us, or find quick answers in the help center.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Phone className="h-3.5 w-3.5 text-[#0E9F6E]" />
              Helpline
            </div>
            <p className="font-mono-num mt-1.5 text-sm font-bold text-slate-900">
              +92 302 2222277
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Mail className="h-3.5 w-3.5 text-[#0E9F6E]" />
              Email
            </div>
            <p className="mt-1.5 text-sm font-bold text-slate-900">
              hello@markaz.app
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate({ type: 'home' })}
            className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 text-left transition-colors hover:border-[#0E9F6E]"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <HelpCircle className="h-3.5 w-3.5 text-[#0E9F6E]" />
              Help center
            </div>
            <p className="mt-1.5 text-sm font-bold text-slate-900">
              Browse common questions →
            </p>
          </button>
        </div>

        {/* Interactive Contact Inquiry Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setContactSent(true);
          }}
          className="mt-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6"
        >
          {contactSent ? (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-800">
              <span className="inline-flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-[#0E9F6E]" />
                Message received! Our Islamabad team will reply to {supportEmail || 'you'} within 24 hours.
              </span>
              <button
                type="button"
                onClick={() => {
                  setContactSent(false);
                  setSupportMsg('');
                }}
                className="font-bold underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
              <div className="sm:col-span-3">
                <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={supportName}
                  onChange={(e) => setSupportName(e.target.value)}
                  placeholder="Asad Khan"
                  className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs focus:border-[#0E9F6E] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                  Email / Phone
                </label>
                <input
                  type="text"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs focus:border-[#0E9F6E] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                  How can we help?
                </label>
                <input
                  type="text"
                  required
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                  placeholder="Question about wholesale, COD, or seller onboarding..."
                  className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs focus:border-[#0E9F6E] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#0E9F6E] px-4 text-xs font-bold text-white hover:bg-[#057A55]"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          New to Markaz? Start{' '}
          <button
            type="button"
            onClick={() => onNavigate({ type: 'reseller-app' })}
            className="font-semibold text-[#0E9F6E] hover:underline"
          >
            reselling in Pakistan
          </button>
          , try the{' '}
          <button
            type="button"
            onClick={() => onNavigate({ type: 'resell' })}
            className="font-semibold text-[#0E9F6E] hover:underline"
          >
            dropshipping portal
          </button>
          , browse 150,000+ products on the{' '}
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="font-semibold text-[#0E9F6E] hover:underline"
          >
            Markaz store
          </button>
          , or read practical guides on the{' '}
          <button
            type="button"
            onClick={() => onNavigate({ type: 'blog' })}
            className="font-semibold text-[#0E9F6E] hover:underline"
          >
            Markaz blog
          </button>
          .
        </p>
      </section>

      {/* Culture Grid (16 showcase photos) */}
      <section className="mx-auto max-w-[1280px] px-4 pb-8 lg:px-6">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#181B68] via-[#13516A] to-[#139D53] p-6 sm:p-8">
          <h2 className="text-center font-display text-lg font-bold text-white">
            Culture &amp; Operations
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CULTURE_GALLERY.map((item) => (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-xl border border-white/15 bg-black/20 aspect-[4/3]"
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2 text-[11px] font-semibold text-white">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Highlights (18 products + 18 categories) */}
      <section className="mx-auto max-w-[1280px] px-4 pt-6 pb-12 lg:px-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Inside the Markaz Marketplace
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
            className="text-xs font-semibold text-[#0E9F6E] hover:underline"
          >
            Shop all products →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {PRODUCTS.slice(0, 18).map((p, idx) => (
            <ProductCard
              key={`abt-prod-${p.id}`}
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
          Categories we power across Pakistan
        </h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
          {SHOP_CATEGORY_TILES.map((tile) => (
            <button
              key={`abt-cat-${tile.label}`}
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
