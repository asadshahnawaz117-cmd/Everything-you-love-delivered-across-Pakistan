import React, { useState } from 'react';
import { ArrowRight, BookOpen, Calendar, X } from 'lucide-react';
import { AppView } from '../../types';

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  theme: string;
  readTime: string;
  body: string[];
}

const BLOG_CATEGORIES = [
  'All',
  'Business Ideas',
  'Dropshipping',
  'Online Selling',
  'Online Shopping',
  'Company',
  'Books',
  'Marketing',
  'Earning Apps',
  'Case Study',
  'Product',
  'Growth',
];

const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'abaya-fabrics',
    title: 'Abaya Fabrics in Pakistan: Nida, Crepe and Georgette Explained',
    category: 'Online Shopping',
    date: '15 Oct 2026',
    readTime: '4 min read',
    theme: 'from-[#0F172A] to-[#1E3A5F]',
    excerpt: 'Nida, crepe or georgette? How the three abaya fabrics differ on drape, opacity, summer breathability and price.',
    body: [
      'When shopping for abayas online in Pakistan, fabric choice decides comfort far more than embroidery alone. Korean Nida leads for formal occasions thanks to its smooth matte sheen and full opacity without lining.',
      'Medina silk and bubble crepe offer lighter summer airflow and wrinkle resistance for university or office commutes, while double georgette pairs gracefully with layered chiffon hijabs.',
      'Before ordering on Markaz, always check the fabric GSM notes and supplier photos in natural daylight to match your climate and occasion.',
    ],
  },
  {
    id: 'who-pays-delivery',
    title: 'Who Pays Delivery Charges in Dropshipping? (Pakistan)',
    category: 'Dropshipping',
    date: '14 Sep 2026',
    readTime: '3 min read',
    theme: 'from-[#0B2D26] to-[#145345]',
    excerpt: 'The customer pays delivery on an order that completes. You carry 0 when a COD parcel is refused. Here is how Markaz handles shipping.',
    body: [
      'New resellers often worry they will lose money out of pocket if a Cash on Delivery parcel returns unpaid. With Markaz, zero upfront deposit is charged from your wallet.',
      'Markaz displays the flat nationwide shipping fee upfront on every product page, adds your chosen profit margin to the COD slip, and settles your margin directly into JazzCash, Easypaisa, or your bank after delivery.',
    ],
  },
  {
    id: 'refunds-returns',
    title: 'How to Handle Refunds & Returns as a Reseller in Pakistan',
    category: 'Online Selling',
    date: '1 Sep 2026',
    readTime: '5 min read',
    theme: 'from-[#1B1A4B] to-[#0F4C5C]',
    excerpt: 'A refund request is not a fight. The first four kinds of issues, what returns, what to say in the chat, and how Markaz protects buyers.',
    body: [
      'Clear return expectations turn first-time COD buyers into repeat customers. Every Markaz order carries a transparent 7-day replacement or return window if a product arrives damaged or mismatched.',
      'Teach your buyers to record a quick unboxing clip, submit the request inside the Markaz app within 7 days, and let our courier partners arrange reverse pickup.',
    ],
  },
  {
    id: 'fob-price',
    title: 'What Is FOB Price? Shipping Terms for Pakistani Buyers',
    category: 'Business Ideas',
    date: '30 Oct 2026',
    readTime: '4 min read',
    theme: 'from-[#1E293B] to-[#334155]',
    excerpt: 'FOB price is what a supplier charges to load your goods onto the ship. What EXW, FOB and CIF each cover for importers.',
    body: [
      'Understanding Free On Board (FOB) pricing helps small merchants compare factory quotes from Yiwu and Shenzhen accurately against landed PKR prices.',
      'With Markaz China, freight, port clearance, and customs duties are already calculated into your final delivered price in rupees — no surprise port fees.',
    ],
  },
  {
    id: 'sell-without-website',
    title: 'How to sell things on Instagram without a website',
    category: 'Marketing',
    date: '5 Jan 2026',
    readTime: '6 min read',
    theme: 'from-[#064E3B] to-[#0E7490]',
    excerpt: 'Discover how to earn money through social commerce in Pakistan using WhatsApp, Instagram Reels, and Markaz product links.',
    body: [
      'You do not need expensive hosting or custom checkout gateways to make your first 50 sales in Pakistan. Start with crisp studio photos, transparent PKR pricing, and quick WhatsApp Business catalog replies.',
      'Pin your top-selling Lawn suits, watches, and skincare deals in Instagram Highlights and fulfill every COD order directly from Markaz.',
    ],
  },
  {
    id: '14-ways-earn',
    title: '14 Easy Ways to Earn Money in Pakistan (2026)',
    category: 'Earning Apps',
    date: '31 Dec 2025',
    readTime: '7 min read',
    theme: 'from-[#0F172A] to-[#0E9F6E]',
    excerpt: 'Wondering what are the top easy ways to earn money in Pakistan? Compare reselling, affiliate sharing, and zero-investment stores.',
    body: [
      'From zero-investment social reselling on Markaz to curated Shopify dropshipping and affiliate content creation, digital commerce lets students and home earners build steady PKR income without inventory risk.',
    ],
  },
  {
    id: 'why-markaz-no-1',
    title: 'Why Markaz is the #1 Online App in Pakistan (2026)',
    category: 'Company',
    date: '17 Sep 2025',
    readTime: '4 min read',
    theme: 'from-[#092319] to-[#13795B]',
    excerpt: 'Discover why Markaz is Pakistan’s #1 online app empowering over 150,000 entrepreneurs with verified products and COD.',
    body: [
      'Built for Pakistan’s mobile-first sellers and shoppers, Markaz combines verified local suppliers, China factory sourcing, and nationwide courier rails into one reliable platform.',
    ],
  },
  {
    id: 'shoe-size-guide',
    title: 'How to Get Your Shoe Size Right When Ordering Online',
    category: 'Online Shopping',
    date: '6 Oct 2026',
    readTime: '3 min read',
    theme: 'from-[#312E81] to-[#1E40AF]',
    excerpt: 'Measure your foot in cm, then buy against the size chart. How UK, US, EU and CN sizes line up across Pakistan.',
    body: [
      'Stand on paper against a wall, mark heel to longest toe in centimeters, and match CM length rather than guessing between UK and EU labels.',
    ],
  },
  {
    id: 'daraz-vs-markaz',
    title: 'Daraz vs Markaz for Resellers: Fees, COD & Payouts',
    category: 'Dropshipping',
    date: '14 Jul 2026',
    readTime: '5 min read',
    theme: 'from-[#065F46] to-[#047857]',
    excerpt: 'Compare wholesale margin control, zero-inventory shipping, and payout timelines for Pakistani online resellers.',
    body: [
      'While traditional marketplaces charge seller commissions and require holding stock, Markaz lets resellers set their own profit margin per order with zero upfront inventory.',
    ],
  },
  {
    id: 'product-bundling',
    title: 'Product Bundling: Raise Your Average Order Value',
    category: 'Online Selling',
    date: '15 Aug 2026',
    readTime: '4 min read',
    theme: 'from-[#1E293B] to-[#0F766E]',
    excerpt: 'A second item in the same order delivers higher reseller margins while keeping shipping flat for your customer.',
    body: [
      'Pair matching earrings with stitched kurtis or bundle travel tumblers with kitchen choppers to increase customer value and boost your profit per parcel.',
    ],
  },
  {
    id: 'top-books-pakistan',
    title: 'The Best Books on Pakistan’s History & Business Mindset',
    category: 'Books',
    date: '11 Jul 2026',
    readTime: '5 min read',
    theme: 'from-[#0F172A] to-[#475569]',
    excerpt: 'Essential Urdu and English titles delivered nationwide from Urdu Bazaar suppliers on Markaz.',
    body: [
      'Explore bestselling business, mindset, and classic Urdu literature bundles priced fairly for students and book clubs across Pakistan.',
    ],
  },
  {
    id: 'cro-strategy',
    title: 'How to Develop a CRO Strategy to Grow Your Online Store',
    category: 'Growth',
    date: '29 Sep 2026',
    readTime: '5 min read',
    theme: 'from-[#134E4A] to-[#0F172A]',
    excerpt: 'Practical Conversion Rate Optimization tips for Pakistani Shopify and WooCommerce dropshipping storefronts.',
    body: [
      'Show clear PKR Cash on Delivery badges above the fold, highlight 7-day return protection, and keep checkout mobile forms fast and simple.',
    ],
  },
];

export const BlogPage: React.FC<{ onNavigate: (view: AppView) => void }> = ({
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingArticle, setReadingArticle] = useState<BlogArticle | null>(null);

  const visibleArticles =
    selectedCategory === 'All'
      ? BLOG_ARTICLES
      : BLOG_ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div className="bg-[#F8FAFC] pb-12">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-9 lg:px-6">
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Markaz Blog
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Dropshipping, business ideas and earning guides for Pakistan.
          </p>

          {/* Category Filter Pills (Matches video 01:45) */}
          <div className="mt-5 flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? BLOG_ARTICLES.length
                  : BLOG_ARTICLES.filter((a) => a.category === cat).length;
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? 'border-[#0E9F6E] bg-[#0E9F6E] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-[#0E9F6E] hover:text-[#0E9F6E]'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 text-[10px] tabular-nums ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="mx-auto max-w-[1280px] px-4 pt-9 lg:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">
            {selectedCategory === 'All'
              ? 'Latest from across the blog'
              : selectedCategory}
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ type: 'resell' })}
            className="text-xs font-semibold text-[#0E9F6E] hover:underline"
          >
            Try Dropshipping Portal →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleArticles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`relative flex h-40 flex-col justify-between bg-gradient-to-br ${article.theme} p-4 text-white`}
              >
                <span className="self-start rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  {article.category}
                </span>
                <p className="font-display text-base font-bold leading-snug line-clamp-2">
                  {article.title}
                </p>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <span className="inline-block self-start rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#0E9F6E]">
                  {article.category}
                </span>
                <h3 className="mt-2 font-display text-sm font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-[#0E9F6E]">
                  {article.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-slate-400">
                  <span>{article.date}</span>
                  <button
                    type="button"
                    onClick={() => setReadingArticle(article)}
                    className="inline-flex items-center gap-1 font-semibold text-[#0E9F6E] hover:underline"
                  >
                    <span>Read</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Reader Modal */}
      {readingArticle && (
        <div
          onClick={() => setReadingArticle(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-label={readingArticle.title}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div
              className={`bg-gradient-to-br ${readingArticle.theme} p-6 text-white`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                  {readingArticle.category}
                </span>
                <button
                  type="button"
                  onClick={() => setReadingArticle(null)}
                  aria-label="Close article"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-3 font-display text-2xl font-extrabold leading-snug">
                {readingArticle.title}
              </h2>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-200">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {readingArticle.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {readingArticle.readTime}
                </span>
              </div>
            </div>

            <div className="space-y-4 p-6 text-sm leading-relaxed text-slate-700">
              <p className="font-medium text-slate-900">{readingArticle.excerpt}</p>
              {readingArticle.body.map((para) => (
                <p key={para}>{para}</p>
              ))}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Ready to start selling with Markaz?
                  </p>
                  <p className="text-xs text-slate-600">
                    Browse 150,000+ products with Cash on Delivery across Pakistan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReadingArticle(null);
                    onNavigate({ type: 'shop', origin: 'pakistan' });
                  }}
                  className="rounded-full bg-[#0E9F6E] px-4 py-2 text-xs font-bold text-white hover:bg-[#057A55]"
                >
                  Explore Store →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
