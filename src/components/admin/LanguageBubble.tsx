'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LanguageBubble() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the bubble
    const dismissed = localStorage.getItem('lang-bubble-dismissed');
    if (!dismissed) {
      // Show after a short delay to not be intrusive
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('lang-bubble-dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-3 sm:p-4 max-w-[280px] sm:max-w-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">Switch to English?</p>
            <p className="text-slate-400 text-xs mt-0.5">The admin panel is also available in English</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-500 hover:text-slate-300 p-0.5 -mt-1 -mr-1"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDismiss}
            className="flex-1 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            No, gracias
          </button>
          <Link
            href="/en/admin"
            className="flex-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium text-center hover:bg-blue-500/30 transition-colors"
          >
            Yes, switch
          </Link>
        </div>
      </div>
    </div>
  );
}
