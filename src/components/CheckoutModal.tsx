import React, { useEffect, useState } from 'react';
import { CheckCircle2, MapPin, ShieldCheck, X } from 'lucide-react';
import { CartItem, Order, UserProfile } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  user: UserProfile | null;
  onClose: () => void;
  onPlaceOrder: (order: Order) => void;
  onViewOrders: () => void;
}

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Hyderabad',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  user,
  onClose,
  onPlaceOrder,
  onViewOrders,
}) => {
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Lahore');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>(
    'Cash on Delivery (COD)'
  );
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setCustomerName((prev) => prev || user.name);
      setCustomerPhone((prev) => prev || user.phone);
      setCity(user.city || 'Lahore');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (item.product.price + (item.isResell ? item.resellerProfit : 0)) *
        item.quantity,
    0
  );
  const totalResellerProfit = items.reduce(
    (sum, item) =>
      sum + (item.isResell ? item.resellerProfit * item.quantity : 0),
    0
  );
  const deliveryFee = subtotal >= 3000 ? 0 : 125;
  const totalPayable = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      setError('Please enter recipient full name, phone number, and complete delivery address.');
      return;
    }

    const newOrder: Order = {
      id: `MKZ-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Confirmed — Preparing Shipment',
      paymentMethod,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      city,
      address: address.trim(),
      items: [...items],
      subtotal,
      deliveryFee,
      totalCustomerPayable: totalPayable,
      totalResellerProfit,
    };

    onPlaceOrder(newOrder);
    setConfirmedOrder(newOrder);
    setError('');
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]">
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-label="Checkout"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {confirmedOrder ? 'Order confirmed' : 'Checkout & Cash on Delivery'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close checkout"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
              <div>
                <p className="font-display text-base font-bold text-slate-900">
                  Order #{confirmedOrder.id} Confirmed — Preparing Shipment
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Dispatched to {confirmedOrder.customerName} in {confirmedOrder.city}. Estimated delivery in 3–5 business days.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-xl border border-slate-200 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-semibold text-slate-900">
                  {confirmedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address</span>
                <span className="font-medium text-slate-900 text-right max-w-xs">
                  {confirmedOrder.address}, {confirmedOrder.city}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500">Total Payable</span>
                <span className="font-mono-num font-bold text-slate-900 tabular-nums">
                  PKR {confirmedOrder.totalCustomerPayable.toLocaleString()}
                </span>
              </div>
              {confirmedOrder.totalResellerProfit > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span className="font-medium">Your Reseller Margin</span>
                  <span className="font-mono-num font-bold tabular-nums">
                    +PKR {confirmedOrder.totalResellerProfit.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Continue shopping
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onViewOrders();
                }}
                className="rounded-xl bg-[#059669] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#047857]"
              >
                View My Orders
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Full name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Mobile number (Pakistan)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Payment method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as Order['paymentMethod'])
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Cash on Delivery (COD)">
                    Cash on Delivery (COD)
                  </option>
                  <option value="Easypaisa / JazzCash">
                    Easypaisa / JazzCash
                  </option>
                  <option value="Card Payment">Debit / Credit Card</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Complete street address & landmark
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400" />
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House #, Street #, Sector / Phase, Nearest Landmark"
                    className="w-full rounded-lg border border-slate-300 py-2.5 pr-3 pl-9 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Total Box */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-[#F7F8FA] p-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span className="font-mono-num font-semibold text-slate-900 tabular-nums">
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="mt-1.5 flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className="font-mono-num font-semibold text-slate-900 tabular-nums">
                  {deliveryFee === 0 ? 'Free' : `PKR ${deliveryFee}`}
                </span>
              </div>
              {totalResellerProfit > 0 && (
                <div className="mt-1.5 flex justify-between text-emerald-700">
                  <span>Your Reseller Profit (transferred after delivery)</span>
                  <span className="font-mono-num font-bold tabular-nums">
                    +PKR {totalResellerProfit.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="mt-2.5 flex justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-slate-900">
                <span>Total Payable ({paymentMethod === 'Cash on Delivery (COD)' ? 'COD' : 'Prepaid'})</span>
                <span className="font-mono-num tabular-nums">
                  PKR {totalPayable.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>7-day return & buyer protection</span>
              </div>
              <button
                type="submit"
                className="ml-auto h-11 rounded-xl bg-[#059669] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#047857]"
              >
                Place Order — PKR {totalPayable.toLocaleString()}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
