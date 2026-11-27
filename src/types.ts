export type MarketplaceOrigin = 'pakistan' | 'china';

export type CategorySlug =
  | 'cosmetics'
  | 'womens-unstitched'
  | 'womens-stitched'
  | 'kids-clothing'
  | 'watches-jewellery'
  | 'electronics'
  | 'bags'
  | 'shoes'
  | 'perfumes'
  | 'kitchenware'
  | 'mens-stitched'
  | 'bedding'
  | 'accessories'
  | 'books';

export type OccasionSlug =
  | 'eid-edit'
  | 'wedding-ready'
  | 'daily-wear'
  | 'office-looks'
  | 'glow-up'
  | 'gift-mode';

export interface ProductColorVariant {
  name: string;
  hex: string;
  image: string;
  imageFilter?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  title: string;
  category: CategorySlug;
  categoryLabel: string;
  subCategory: string;
  origin: MarketplaceOrigin;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  likesCount: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  colors: ProductColorVariant[];
  sizes: string[];
  occasions: OccasionSlug[];
  tags: string[];
  supplierName: string;
  supplierCity: string;
  supplierFollowers: number;
  deliveryDays: string;
  deliveryFee: number;
  courierName: string;
  highlights: {
    material: string;
    pattern: string;
    packageIncludes: string;
    originLabel: string;
  };
  overview: string[];
  reviews: ProductReview[];
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  sponsored?: boolean;
}

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  shortDesc: string;
  heroTitle: string;
  heroSubtitle: string;
  accentBg: string;
  productCountLabel: string;
  image: string;
  subCategories: string[];
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedColorImage: string;
  selectedSize: string;
  isResell: boolean;
  resellerProfit: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'Confirmed — Preparing Shipment' | 'Dispatched via Courier' | 'Delivered';
  paymentMethod: 'Cash on Delivery (COD)' | 'Easypaisa / JazzCash' | 'Card Payment';
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalCustomerPayable: number;
  totalResellerProfit: number;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  isReseller: boolean;
}

export type AppView =
  | { type: 'home' }
  | { type: 'shop'; origin: MarketplaceOrigin }
  | { type: 'category'; slug: CategorySlug }
  | { type: 'search'; query: string }
  | { type: 'product'; productId: string }
  | { type: 'wishlist' }
  | { type: 'orders' }
  | { type: 'resell' };
