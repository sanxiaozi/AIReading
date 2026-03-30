'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';

export function FaqPageClient() {
  const t = useTranslations();
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const qaKeys = Array.from({ length: 10 }, (_, i) => `q${i + 1}` as const);

  return (
    <div className="min-h-screen bg-[#070A12]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Breadcrumb items={[{ label: t('nav.faq') }]} />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden py-12 sm:py-16 px-4">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, #7C5CFF 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {t('faq.title')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('faq.subtitle')}
          </p>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="space-y-3">
          {qaKeys.map((key, index) => {
            const question = t(`faq.qa.${key}.q` as any);
            const answer = t(`faq.qa.${key}.a` as any);
            const isOpen = openIndex === index;

            return (
              <div
                key={key}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/10 transition-colors"
                >
                  <span className="text-white font-medium flex-1 pr-4">
                    <span className="text-purple-400 mr-2">Q{index + 1}.</span>
                    {question}
                  </span>
                  <span
                    className={`text-2xl transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-2 border-t border-white/10">
                    <p className="text-gray-300 leading-relaxed">{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
