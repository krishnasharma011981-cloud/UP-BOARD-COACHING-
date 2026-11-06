import React, { useState, useRef } from 'react';
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
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!slides || slides.length === 0) return null;

  // Duplicate slides for continuous gliding
  const trackSlides = [...slides, ...slides];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-2">
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={scrollContainerRef}
          className={`flex gap-3 sm:gap-5 py-1 ${
            isPaused ? '' : 'animate-slide-track'
          } overflow-x-auto sm:overflow-x-visible no-scrollbar scroll-smooth`}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {trackSlides.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              onClick={() => onNavigate(slide.targetPage)}
              className={`relative w-[85vw] sm:w-[500px] lg:w-[580px] shrink-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${
                slide.gradient || 'from-[#2563eb] via-[#3b38f5] to-[#6338f7]'
              } text-white overflow-hidden shadow-md sm:shadow-lg hover:shadow-xl cursor-pointer transition-shadow duration-300 group h-[190px] sm:h-[230px] flex items-center justify-between ${
                slide.isFounderSlide && slide.imageUrl ? 'p-0' : 'p-4 sm:p-7'
              }`}
            >
              {slide.isFounderSlide && slide.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      '/assets/images/experts_banner_wide_1793943292634.jpg';
                  }}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <>
                  {/* Soft curved wave / circle shapes */}
                  <div className="absolute -right-12 -bottom-16 w-56 sm:w-64 h-56 sm:h-64 rounded-full bg-white/10 pointer-events-none" />
                  <div className="absolute right-16 -top-20 w-48 sm:w-56 h-48 sm:h-56 rounded-full bg-white/5 pointer-events-none" />

                  {/* Left Text & CTA Button */}
                  <div className="relative z-10 flex-1 pr-2 sm:pr-3 space-y-1.5 sm:space-y-2.5">
                    <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      {slide.badge}
                    </span>

                    <div>
                      <h2 className="text-base sm:text-2xl font-heading font-extrabold text-white leading-tight sm:leading-snug line-clamp-2">
                        {slide.title}
                      </h2>
                      {slide.subtitle && (
                        <p className="text-[11px] sm:text-xs font-semibold text-blue-100 mt-0.5 line-clamp-1">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>

                    <p className="text-[10px] sm:text-xs text-blue-50/90 line-clamp-2 leading-relaxed max-w-sm">
                      {slide.description}
                    </p>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(slide.targetPage);
                        }}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-blue-50 text-[#1d4ed8] font-bold text-[11px] sm:text-xs shadow-md transition-all group-hover:translate-x-0.5 cursor-pointer"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Side Image / Mockup */}
                  <div className="relative z-10 shrink-0 flex items-center justify-center">
                    {slide.imageUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-28 sm:w-40 sm:h-44 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/85 shadow-lg bg-slate-900">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                '/assets/images/study_notes_preview_1793429396527.jpg';
                            }}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        {slide.isFounderSlide && (
                          <span className="mt-1 px-2 py-0.5 rounded-full bg-white text-[#1d4ed8] text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider shadow-xs">
                            Ph.D. in English
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="hidden sm:block w-32 sm:w-36 bg-white text-slate-900 rounded-2xl p-2.5 shadow-xl border-2 border-white/70 transform rotate-1 group-hover:rotate-0 transition-transform">
                        <div className="h-12 sm:h-14 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#6338f7] flex items-center justify-center text-white relative overflow-hidden">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/25 flex items-center justify-center">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white ml-0.5" />
                          </div>
                        </div>
                        <div className="mt-2 space-y-0.5 sm:space-y-1">
                          <p className="text-[9px] sm:text-[10px] font-extrabold text-slate-900 truncate">
                            {slide.badge}
                          </p>
                          <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-emerald-600 font-semibold">
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
