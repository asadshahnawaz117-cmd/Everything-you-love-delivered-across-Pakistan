import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from './data/catalog';
import { saveOrderToSupabase } from './lib/supabase/client';
import { AppView, CartItem, Order, Product, ProductColorVariant, UserProfile } from './types';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import {
  LoginModal,
  OrdersView,
  WishlistView,
} from './components/SecondaryViews';
import { SupplierSignupPage } from './components/pages/SupplierSignupPage';
import { AboutPage } from './components/pages/AboutPage';
import { BlogPage } from './components/pages/BlogPage';
import { AffiliatePage } from './components/pages/AffiliatePage';
import { ContactPage } from './components/pages/ContactPage';
import {
  DropshippingPortalPage,
  ExportDataPage,
  ResellerAppPage,
  StoreIntegrationPage,
} from './components/pages/ProductsPages';
import { Footer } from './components/Footer';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [view, setView] = useState<AppView>({ type: 'home' });
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadStorage<string[]>('mkz_recent_searches', ['shirt', 'travel mug'])
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    loadStorage<string[]>('mkz_wishlist', [])
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadStorage<CartItem[]>('mkz_cart', [])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadStorage<Order[]>('mkz_orders', [])
  );
  const [user, setUser] = useState<UserProfile | null>(() =>
    loadStorage<UserProfile | null>('mkz_user', null)
  );

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('mkz_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('mkz_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('mkz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mkz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mkz_user', JSON.stringify(user));
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const navigateTo = (nextView: AppView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setRecentSearches((prev) =>
        [query, ...prev.filter((t) => t.toLowerCase() !== query.toLowerCase())].slice(0, 6)
      );
    }
    navigateTo({ type: 'search', query });
  };

  const handleRemoveRecentSearch = (term: string) => {
    setRecentSearches((prev) => prev.filter((t) => t !== term));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites');
      return exists ? prev.filter((id) => id !== productId) : [productId, ...prev];
    });
  };

  const addItemToCart = (opts: {
    product: Product;
    quantity: number;
    color: string;
    colorImage: string;
    size: string;
    isResell: boolean;
    resellerProfit: number;
  }) => {
    const cartItemId = `${opts.product.id}::${opts.color}::${opts.size}::${
      opts.isResell ? opts.resellerProfit : 0
    }`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + opts.quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product: opts.product,
          quantity: opts.quantity,
          selectedColor: opts.color,
          selectedColorImage: opts.colorImage,
          selectedSize: opts.size,
          isResell: opts.isResell,
          resellerProfit: opts.resellerProfit,
        },
      ];
    });
  };

  const handleQuickAdd = (product: Product, chosenColor?: ProductColorVariant) => {
    const activeColor = chosenColor || product.colors[0];
    addItemToCart({
      product,
      quantity: 1,
      color: activeColor?.name || 'Standard',
      colorImage: activeColor?.image || product.images[0],
      size: product.sizes[0] || 'Standard',
      isResell: false,
      resellerProfit: 0,
    });
    showToast(`Added "${product.title}" (${activeColor?.name || 'Standard'}) to bag`);
  };

  const handleAddToCartFromPDP = (opts: {
    product: Product;
    quantity: number;
    color: string;
    colorImage: string;
    size: string;
    isResell: boolean;
    resellerProfit: number;
  }) => {
    addItemToCart(opts);
    showToast(`Added ${opts.quantity}x to your bag`);
  };

  const handleBuyNowFromPDP = (opts: {
    product: Product;
    quantity: number;
    color: string;
    colorImage: string;
    size: string;
    isResell: boolean;
    resellerProfit: number;
  }) => {
    addItemToCart(opts);
    setCheckoutOpen(true);
  };

  const handleUpdateQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handlePlaceOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    void saveOrderToSupabase(order);
  };

  const handleSelectProduct = (product: Product) => {
    navigateTo({ type: 'product', productId: product.id });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeProduct =
    view.type === 'product'
      ? PRODUCTS.find((p) => p.id === view.productId) || PRODUCTS[0]
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA] text-slate-900">
      <Header
        currentView={view}
        searchQuery={searchQuery}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        ordersCount={orders.length}
        user={user}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'ur' : 'en'))}
        onNavigate={navigateTo}
        onSearchSubmit={handleSearchSubmit}
        onOpenCart={() => setCartOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
      />

      <main className="flex-1">
        {view.type === 'home' && (
          <HomeView
            lang={lang}
            wishlistIds={wishlistIds}
            onNavigate={navigateTo}
            onSearchSubmit={handleSearchSubmit}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {view.type === 'shop' && (
          <CatalogView
            mode="shop"
            originFilter={view.origin}
            recentSearches={recentSearches}
            wishlistIds={wishlistIds}
            onNavigate={navigateTo}
            onSearchSubmit={handleSearchSubmit}
            onRemoveRecentSearch={handleRemoveRecentSearch}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {view.type === 'category' && (
          <CatalogView
            mode="category"
            categorySlug={view.slug}
            recentSearches={recentSearches}
            wishlistIds={wishlistIds}
            onNavigate={navigateTo}
            onSearchSubmit={handleSearchSubmit}
            onRemoveRecentSearch={handleRemoveRecentSearch}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {view.type === 'collection' && (
          <CatalogView
            mode="collection"
            collectionId={view.collectionId}
            collectionTitle={view.title}
            recentSearches={recentSearches}
            wishlistIds={wishlistIds}
            onNavigate={navigateTo}
            onSearchSubmit={handleSearchSubmit}
            onRemoveRecentSearch={handleRemoveRecentSearch}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {view.type === 'search' && (
          <CatalogView
            mode="search"
            searchQuery={view.query}
            recentSearches={recentSearches}
            wishlistIds={wishlistIds}
            onNavigate={navigateTo}
            onSearchSubmit={handleSearchSubmit}
            onRemoveRecentSearch={handleRemoveRecentSearch}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {view.type === 'product' && activeProduct && (
          <ProductDetailView
            product={activeProduct}
            isWishlisted={wishlistIds.includes(activeProduct.id)}
            wishlistIds={wishlistIds}
            onNavigate={navigateTo}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCartFromPDP}
            onBuyNow={handleBuyNowFromPDP}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {view.type === 'wishlist' && (
          <WishlistView
            wishlistIds={wishlistIds}
            onNavigate={navigateTo}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {view.type === 'orders' && (
          <OrdersView
            orders={orders}
            wishlistIds={wishlistIds}
            onNavigate={navigateTo}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {view.type === 'resell' && (
          <DropshippingPortalPage
            onNavigate={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view.type === 'reseller-app' && (
          <ResellerAppPage
            onNavigate={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view.type === 'shopify' && (
          <StoreIntegrationPage
            platform="shopify"
            onNavigate={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view.type === 'woocommerce' && (
          <StoreIntegrationPage
            platform="woocommerce"
            onNavigate={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view.type === 'export-data' && (
          <ExportDataPage
            onNavigate={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view.type === 'about' && (
          <AboutPage
            onNavigate={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view.type === 'blog' && (
          <BlogPage
            onNavigate={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view.type === 'affiliate' && (
          <AffiliatePage
            onNavigate={navigateTo}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view.type === 'contact' && (
          <ContactPage
            onNavigate={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view.type === 'supplier' && (
          <SupplierSignupPage
            onNavigate={navigateTo}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}
      </main>

      {view.type !== 'supplier' && (
        <Footer onNavigate={navigateTo} onSearchSubmit={handleSearchSubmit} />
      )}

      <CartDrawer
        isOpen={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onBrowseCatalog={() => navigateTo({ type: 'shop', origin: 'pakistan' })}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        items={cart}
        user={user}
        onClose={() => setCheckoutOpen(false)}
        onPlaceOrder={handlePlaceOrder}
        onViewOrders={() => navigateTo({ type: 'orders' })}
      />

      <LoginModal
        isOpen={loginOpen}
        user={user}
        onClose={() => setLoginOpen(false)}
        onLogin={(profile) => {
          setUser(profile);
          showToast(`Signed in as ${profile.name}`);
        }}
        onLogout={() => {
          setUser(null);
          showToast('Signed out');
        }}
      />

      {/* Non-intrusive bottom toast */}
      {toastMsg && (
        <div
          role="status"
          className="fixed right-5 bottom-16 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span className="max-w-xs truncate">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
