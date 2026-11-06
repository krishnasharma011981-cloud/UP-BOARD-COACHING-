/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { HomeSliderItem, PageView } from '../types';

interface HomeSliderBannerProps {
  slides: HomeSliderItem[];
  onNavigate: (page: PageView) => void;
}

export const HomeSliderBanner: React.FC<HomeSliderBannerProps> = ({
  slides,
  onNavigate,
}) => {
  if (!slides || slides.length === 0) return null;

  // Duplicate slides for seamless, continuous video-like horizontal gliding
  const trackSlides = [...slides, ...slides];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="animate-slide-track gap-5 py-1">
          {trackSlides.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              onClick={() => onNavigate(slide.targetPage)}
              className={`relative w-[330px] sm:w-[540px] lg:w-[600px] shrink-0 rounded-3xl bg-gradient-to-r ${
                slide.gradient || 'from-[#2563eb] via-[#3b38f5] to-[#6338f7]'
              } text-white overflow-hidden shadow-lg hover:shadow-xl cursor-pointer transition-shadow duration-300 group h-[230px] flex items-center justify-between ${
                slide.isFounderSlide && slide.imageUrl ? 'p-0' : 'px-6 py-6 sm:px-8'
              }`}
            >
              {slide.isFounderSlide && slide.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <>
              {/* Soft curved wave / circle shapes matching reference design */}
              <div className="absolute -right-12 -bottom-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute right-16 -top-20 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

              {/* Left Text & White CTA Button */}
              <div className="relative z-10 flex-1 pr-3 space-y-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  {slide.badge}
                </span>

                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white leading-snug">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="text-xs font-semibold text-blue-100 mt-0.5">
                      {slide.subtitle}
                    </p>
                  )}
                </div>

                <p className="text-xs text-blue-50/90 line-clamp-2 leading-relaxed max-w-sm">
                  {slide.description}
                </p>

                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(slide.targetPage);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-[#1d4ed8] font-bold text-xs shadow-md transition-all group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Side: Large Side-Angle Founder Portrait OR Mini App Preview Mockup */}
              <div className="relative z-10 shrink-0 flex items-center justify-center">
                {slide.imageUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="w-36 h-40 sm:w-44 sm:h-48 rounded-2xl overflow-hidden border-2 border-white/85 shadow-2xl bg-slate-900">
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    {slide.isFounderSlide && (
                      <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#1d4ed8] text-[9px] font-extrabold uppercase tracking-wider shadow-xs">
                        Ph.D. in English
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:block w-36 bg-white text-slate-900 rounded-2xl p-2.5 shadow-xl border-2 border-white/70 transform rotate-1 group-hover:rotate-0 transition-transform">
                    <div className="h-14 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#6338f7] flex items-center justify-center text-white relative overflow-hidden">
                      <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] font-extrabold text-slate-900 truncate">
                        {slide.badge}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">UPMSP 2027 Ready</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
