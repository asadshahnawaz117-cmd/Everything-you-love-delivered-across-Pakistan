import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { AppView } from '../../types';
import { HERO_DELIVERY_IMAGE } from '../../data/catalog';
import { MarkazLogo } from '../MarkazLogo';

interface SupplierSignupPageProps {
  onNavigate: (view: AppView) => void;
}

export const SupplierSignupPage: React.FC<SupplierSignupPageProps> = ({
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid business email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0F8467] via-[#0B5D8C] to-[#083A84] text-white">
      {/* Top Bar */}
      <div className="relative z-20 mx-auto flex max-w-[1280px] items-center justify-between px-4 py-5 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/20"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Markaz</span>
        </button>

        <div className="rounded-full bg-white px-4 py-1.5 shadow-md">
          <MarkazLogo size="sm" />
        </div>
      </div>

      {/* Main Split Content (Matches video 00:00 & 02:10) */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-[1280px] grid-cols-1 items-center gap-10 px-4 pb-12 lg:grid-cols-12 lg:px-8">
        {/* Left Visual: Oversized Lime Green M Ribbon + Seller Device Preview */}
        <div className="relative flex items-center justify-center lg:col-span-6">
          <svg
            viewBox="0 0 420 340"
            fill="none"
            className="pointer-events-none w-full max-w-[440px] opacity-95 drop-shadow-2xl"
            aria-hidden="true"
          >
            <path
              d="M38 285V95C38 72 68 62 84 80L196 205C204 214 216 214 224 205L336 80C352 62 382 72 382 95V285"
              stroke="#5EE02A"
              strokeWidth="62"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Foreground Seller Card & Phone Mockup */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-end gap-4">
              <div className="relative h-72 w-56 overflow-hidden rounded-3xl border-4 border-white/25 bg-[#0A2540] shadow-2xl sm:h-80 sm:w-64">
                <img
                  src={HERO_DELIVERY_IMAGE}
                  alt="Markaz Verified Seller"
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08223C]/95 via-[#08223C]/65 to-transparent p-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#199375] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Seller
                  </span>
                  <p className="mt-1.5 font-display text-sm font-bold text-white">
                    Sell to 3M+ shoppers across Pakistan
                  </p>
                </div>
              </div>

              {/* Phone App Emblem */}
              <div className="hidden -ml-10 mb-6 w-36 rounded-2xl border-4 border-slate-900 bg-slate-950 p-3 shadow-2xl sm:block">
                <div className="flex aspect-[9/14] flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#0E2439] to-[#0B4F43] p-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md">
                    <span className="font-display text-xl font-black text-[#21B65A]">
                      M
                    </span>
                  </div>
                  <p className="mt-2.5 text-[11px] font-bold text-white">
                    Markaz Seller
                  </p>
                  <p className="mt-0.5 text-[9px] text-emerald-200">
                    Fast payouts · COD ready
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form (Matches video 00:00 & 02:10–02:23) */}
        <div className="mx-auto w-full max-w-md lg:col-span-6">
          {submitted ? (
            <div className="rounded-2xl border border-white/20 bg-[#0A2A4A]/65 p-8 text-center backdrop-blur-md shadow-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#199375] text-white">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-bold">
                Application Received
              </h1>
              <p className="mt-2 text-sm text-slate-200">
                Thank you for applying with <span className="font-semibold text-white">{email}</span>. Our supplier onboarding team will review your store and notify you once approved.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate({ type: 'shop', origin: 'pakistan' })}
                  className="rounded-full bg-[#199375] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#147A60]"
                >
                  Browse Marketplace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="rounded-full border border-white/30 px-6 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Become a Markaz Seller 🚀
                </h1>
                <p className="mt-2 text-sm text-slate-100/90">
                  Apply in about 10 minutes — we&apos;ll notify you once you&apos;re approved
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-300/40 bg-rose-950/60 px-4 py-2.5 text-xs font-medium text-rose-100">
                  {error}
                </div>
              )}

              <div className="pt-2 space-y-3.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  aria-label="Email Address"
                  className="h-12 w-full rounded-md border border-white/25 bg-[#092C52]/55 px-4 text-sm text-white placeholder:text-slate-300 focus:border-[#5EE02A] focus:outline-none"
                />

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password"
                    aria-label="Create Password"
                    className="h-12 w-full rounded-md border border-white/25 bg-[#092C52]/55 px-4 pr-11 text-sm text-white placeholder:text-slate-300 focus:border-[#5EE02A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute top-3.5 right-3 text-slate-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  aria-label="Confirm Password"
                  className="h-12 w-full rounded-md border border-white/25 bg-[#092C52]/55 px-4 text-sm text-white placeholder:text-slate-300 focus:border-[#5EE02A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 h-12 w-full rounded-full bg-[#199375] text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-[#147B61]"
              >
                SIGN UP
              </button>

              <p className="pt-1 text-center text-xs text-slate-200/80">
                Zero monthly fees · Nationwide courier pickup · Weekly bank settlements
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
