'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Battery,
  Ruler,
  MessageCircle,
  MapPin,
  CalendarClock,
  ShieldCheck,
  Bike,
  Phone,
  ChevronRight,
  HelpCircle,
  Star,
  Instagram,
  Facebook,
  X
} from 'lucide-react';
import { BackpackerBookingForm } from '@/components/forms/BackpackerBookingForm';

/**
 * Mobile-First Landing Page for "Be On Bikes" - English Version
 * Target: Backpackers in Sunshine Coast
 * Stack: Next.js 15, Tailwind CSS
 */

export default function HomePageEN() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [prices, setPrices] = useState({
    backpacker_weekly: "85",
    backpacker_weekly_original: "120",
    bond_weeks: "2",
    min_weeks: "2",
  });

  useEffect(() => {
    fetch('/api/prices')
      .then(res => res.json())
      .then(data => setPrices(data))
      .catch(() => {});
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const whatsappNumber = "61403460777";
  const whatsappDisplay = "0403 460 777";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi,%20I'm%20interested%20in%20renting%20an%20E-Bike%20in%20Sunshine%20Coast.`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 md:pb-0">

      {/* --- 1. STICKY MOBILE HEADER --- */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-md mx-auto md:max-w-5xl px-4 h-16 flex items-center justify-between">
          {/* Brand Logo Area */}
          <Link href="/en" className="flex items-center gap-2 font-black text-xl tracking-tighter text-slate-900">
            <div className="bg-orange-500 text-white p-1.5 rounded-lg">
              <Bike size={20} strokeWidth={3} />
            </div>
            <span>BE ON BIKES</span>
          </Link>

          {/* Language Switch & WhatsApp */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded border border-slate-200 hover:border-slate-300 transition-colors"
            >
              ES
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-bold text-sm border border-green-200 active:scale-95 transition-transform"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">{whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto md:max-w-5xl md:grid md:grid-cols-2 md:gap-8 md:p-8">

        {/* --- LEFT COLUMN (Mobile: Top) --- */}
        <div className="space-y-6">

          {/* --- 2. HERO SECTION & PRICING --- */}
          <section className="px-4 pt-6 pb-2">
            <div className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wide text-orange-600 uppercase bg-orange-100 rounded-full">
              Sunshine Coast
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-2">
              Your E-Bike <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Fast and Easy.
              </span>
            </h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              The best option for transport and mobility across the Sunshine Coast.
            </p>
          </section>

          {/* PRICING CARD (The Hook) */}
          <section className="px-4">
            <div className="relative overflow-hidden bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-6">

              {/* Discount Tag */}
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                LIMITED OFFER
              </div>

              <div className="flex flex-col items-start">
                <span className="text-slate-400 font-semibold text-lg line-through decoration-red-500 decoration-2">
                  ${prices.backpacker_weekly_original} AUD
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-slate-900 tracking-tighter">${prices.backpacker_weekly}</span>
                  <span className="text-xl font-bold text-slate-500">/week</span>
                </div>
                <p className="text-sm text-slate-400 font-medium mt-1">Australian Dollars (AUD)</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-800 text-sm font-bold border border-yellow-200">
                  <CalendarClock size={16} />
                  Minimum {prices.min_weeks} weeks
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold border border-slate-200">
                  <ShieldCheck size={16} />
                  Bond: {prices.bond_weeks} weeks
                </div>
              </div>
            </div>
          </section>

          {/* --- 3. SPECS GRID --- */}
          <section className="px-4">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Zap className="text-orange-500" size={20} />
              Specifications
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Spec 1 */}
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-full mb-2">
                  <Zap size={20} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none">45</span>
                <span className="text-xs font-bold text-slate-400 uppercase mt-1">km/h Max</span>
              </div>

              {/* Spec 2 */}
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="bg-green-50 text-green-600 p-2 rounded-full mb-2">
                  <Battery size={20} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none">60</span>
                <span className="text-xs font-bold text-slate-400 uppercase mt-1">km Range</span>
              </div>

              {/* Spec 3 */}
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="bg-purple-50 text-purple-600 p-2 rounded-full mb-2">
                  <Ruler size={20} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none">1.55</span>
                <span className="text-xs font-bold text-slate-400 uppercase mt-1">Meters +</span>
              </div>
            </div>
          </section>

          {/* --- HOW IT WORKS --- */}
          <section className="px-4 py-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">How does it work?</h3>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Book Online",
                  desc: "Complete the form in 2 minutes.",
                  color: "bg-blue-100 text-blue-700"
                },
                {
                  step: 2,
                  title: "Get Your Bike",
                  desc: "We deliver across all Sunshine Coast.",
                  color: "bg-orange-100 text-orange-700"
                },
                {
                  step: 3,
                  title: "Start Riding!",
                  desc: "Move freely and save money.",
                  color: "bg-green-100 text-green-700"
                }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center font-black text-sm shrink-0`}>
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* --- RIGHT COLUMN (Mobile: Bottom) --- */}
        <div className="space-y-6">

          {/* --- 4. WHAT'S INCLUDED --- */}
          <section className="px-4 md:pt-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-500 rounded-full blur-2xl opacity-20"></div>

              <h3 className="text-xl font-bold mb-4 relative z-10">What&apos;s included in your rental?</h3>
              <ul className="space-y-4 relative z-10">
                {[
                  { icon: Bike, text: "Helmet included" },
                  { icon: ShieldCheck, text: "Security lock" },
                  { icon: Zap, text: "Front and rear lights" },
                  { icon: Phone, text: "Phone holder (GPS)" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="bg-slate-800 p-1.5 rounded-full text-orange-400">
                      <item.icon size={18} />
                    </div>
                    <span className="font-medium text-slate-100">{item.text}</span>
                  </li>
                ))}

                {/* Special highlight item */}
                <li className="flex items-start gap-3 pt-2 border-t border-slate-700 mt-2">
                  <div className="bg-green-900/50 p-1.5 rounded-full text-green-400 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-green-400 block">Home Delivery</span>
                    <span className="text-xs text-slate-400">Across all Sunshine Coast</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* --- 5. LONG TERM INCENTIVE --- */}
          <section className="px-4">
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-white p-2 rounded-full text-orange-600 shadow-sm shrink-0">
                <CalendarClock size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide">Staying longer?</h4>
                <p className="text-sm font-medium text-slate-700 leading-tight mt-1">
                  Special discounts from the <span className="font-bold underline decoration-orange-500">4th week</span>!
                </p>
              </div>
            </div>
          </section>

          {/* --- TESTIMONIALS --- */}
          <section className="px-4">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={20} />
              What riders say
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
              {[
                {
                  name: "Juan (Chile)",
                  text: "I live in Buderim and was worried about the hills, but the bike handles them all easily. So much power!"
                },
                {
                  name: "Cami (Argentina)",
                  text: "I work in Noosa. Going up Noosa Dr from Hastings St every day is effortless now. Battery is amazing."
                },
                {
                  name: "Lucas (Argentina)",
                  text: "The battery lasts forever! I commute to work 3 times a week and still have charge left. Incredible."
                },
                {
                  name: "Sofia (Chile)",
                  text: "Without a car here it's tough, buses don't come often and parking is impossible. The e-bike helps so much, I go everywhere!"
                },
              ].map((review, i) => (
                <div key={i} className="min-w-[260px] bg-white p-4 rounded-xl border border-slate-100 shadow-sm snap-center">
                  <div className="flex text-yellow-400 mb-2">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-slate-600 italic mb-3">&quot;{review.text}&quot;</p>
                  <p className="text-xs font-bold text-slate-900">{review.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* --- FAQ --- */}
          <section className="px-4 mb-4">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HelpCircle className="text-slate-400" size={20} />
              Frequently Asked Questions
            </h3>
            <div className="space-y-2">
              {[
                { q: "Do I need a license?", a: "No, our E-Bikes comply with Queensland regulations. No license required." },
                { q: "How do I pay the bond?", a: "The security deposit is paid when you receive the bike and returned at the end." },
              ].map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-800"
                  >
                    {faq.q}
                    <ChevronRight size={16} className={`transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed bg-slate-50 border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* --- DESKTOP CTA --- */}
          <section className="hidden md:block px-4">
            <div className="bg-white border rounded-xl p-6 text-center">
              <h3 className="font-bold text-xl mb-2">Ready to ride?</h3>
              <p className="text-slate-500 mb-4">Book your bike today and start moving.</p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="block w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Book Now
              </button>
            </div>
          </section>
        </div>

      </main>

      {/* --- BOOKING MODAL --- */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBookingModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Book E-Bike</h2>
                <p className="text-sm text-slate-500">Fill in your details</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <BackpackerBookingForm lang="en" />
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 md:px-8 mt-8 pb-32 md:pb-10">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-white mb-4">
              <div className="bg-orange-500 text-white p-1 rounded">
                <Bike size={16} strokeWidth={3} />
              </div>
              <span>BE ON BIKES</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Making mobility easier in Sunshine Coast for backpackers and travelers. Fast, safe and affordable.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Sunshine Coast, QLD</li>
              <li>info@beonbikes.com</li>
              <li>0403 460 777</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Follow us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/beonbikes" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="https://facebook.com/beonbikes" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook size={20} /></a>
            </div>
            <div className="mt-4">
              <Link href="/" className="text-sm hover:text-white transition-colors">
                Version en Espanol →
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-slate-800 text-xs text-center md:text-left">
          © {new Date().getFullYear()} Be On Bikes. All rights reserved.
        </div>
      </footer>

      {/* --- MOBILE FIXED BOTTOM CTA BAR --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 pb-8 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex gap-3 max-w-md mx-auto">
          {/* Secondary Action */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold py-3 active:bg-green-100"
          >
            <MessageCircle size={20} className="mb-0.5" />
            <span className="text-[10px] uppercase tracking-wide">WhatsApp</span>
          </a>

          {/* Primary Action */}
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex-[2.5] bg-orange-600 text-white rounded-xl font-bold text-lg py-3 shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            Book Now
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-slate-400 font-medium">
            Based in Mooloolaba - Delivery across Sunshine Coast
          </p>
        </div>
      </div>

    </div>
  );
}
