"use client";
import TopperCards from "@/components/CardComponent/TopperCards";
import { useEffect, useRef, useState } from "react";

const AUTOPLAY_DELAY = 4000;

const MeetOurToppers = () => {
  const [toppers, setToppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const autoplayRef = useRef();

  // Responsive cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) setCardsPerView(4); // lg+
      else if (window.innerWidth >= 768) setCardsPerView(2); // md
      else setCardsPerView(1); // sm
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  useEffect(() => {
    const fetchToppers = async () => {
      try {
        const res = await import("@/utils/common-axios").then((m) =>
          m.getAllToppers()
        );
        setToppers(res.data.toppers || []);
      } catch (err) {
        setError("Failed to load toppers");
      } finally {
        setLoading(false);
      }
    };
    fetchToppers();
  }, []);

  // Autoplay logic
  useEffect(() => {
    if (toppers.length === 0) return;
    const play = () => {
      setCurrentIndex((prev) => {
        const numSlides = Math.ceil(toppers.length / cardsPerView);
        return (prev + 1) % numSlides;
      });
    };
    autoplayRef.current = setInterval(play, AUTOPLAY_DELAY);
    return () => clearInterval(autoplayRef.current);
  }, [toppers, cardsPerView]);

  // Pause autoplay on hover
  const handleMouseEnter = () => clearInterval(autoplayRef.current);
  const handleMouseLeave = () => {
    if (toppers.length === 0) return;
    const numSlides = Math.ceil(toppers.length / cardsPerView);
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % numSlides);
    }, AUTOPLAY_DELAY);
  };

  // Group toppers into slides
  const getSlides = () => {
    const slides = [];
    for (let i = 0; i < toppers.length; i += cardsPerView) {
      slides.push(toppers.slice(i, i + cardsPerView));
    }
    return slides;
  };
  const slides = getSlides();
  const numSlides = slides.length;

  // Navigation logic
  const goTo = (idx) => setCurrentIndex(idx);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % numSlides);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + numSlides) % numSlides);

  // For centering empty slots in last slide
  const isPartialSlide = slides[currentIndex]?.length < cardsPerView;

  return (
    <section className="relative py-10 sm:py-16 md:py-20 lg:py-24 px-2 md:px-8 lg:px-16 bg-gradient-to-br from-red-50 via-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-10 -left-10 w-40 md:w-52 h-40 md:h-52 bg-red-100 rounded-full opacity-30 blur-2xl z-0" />
      <div className="absolute -bottom-10 -right-10 w-40 md:w-52 h-40 md:h-52 bg-blue-100 rounded-full opacity-30 blur-2xl z-0" />
      <div className="relative z-10">
        <div className="text-center flex flex-col md:flex-row md:justify-center gap-3 md:gap-5 items-center mb-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 tracking-tight drop-shadow-sm">
            Inspiring Success Stories
          </h1>
          <span className="text-3xl md:text-4xl hidden md:block text-gray-300">
            |
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 via-pink-500 to-blue-600 bg-clip-text text-transparent drop-shadow-md">
            Our Toppers
          </h1>
        </div>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
          Meet the students who have excelled in their academic journey at KCC
          Classes. Their dedication and achievements inspire us all!
        </p>
        <div className="relative max-w-7xl mx-auto">
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && toppers.length === 0 && (
            <div className="text-center">No toppers found.</div>
          )}
          {!loading && !error && toppers.length > 0 && (
            <div
              className="relative w-full rounded-3xl shadow-2xl border border-red-100 bg-white/70 backdrop-blur-lg overflow-hidden px-1 sm:px-2 md:px-4 lg:px-8"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Carousel Content with sliding animation */}
              <div className="overflow-hidden w-full">
                <div
                  className={`flex transition-transform duration-700 ease-in-out`}
                  style={{
                    width: `${numSlides * 100}%`,
                    transform: `translateX(-${currentIndex * (100 / numSlides)}%)`,
                  }}
                >
                  {slides.map((slide, slideIdx) => (
                    <div
                      key={slideIdx}
                      className="flex justify-center items-stretch gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full"
                      style={{ width: '100%' }}
                    >
                      {slide.map((student, idx) => (
                        <div
                          key={idx}
                          className={`flex justify-center items-center w-full py-6 sm:py-8 md:py-10 px-1 sm:px-2 md:px-4 lg:px-6`}
                          style={{ flex: `0 0 ${100 / cardsPerView}%`, maxWidth: cardsPerView === 1 ? '100vw' : '100%' }}
                        >
                          <div
                            className={`w-full ${
                              cardsPerView === 1
                                ? "scale-100"
                                : cardsPerView === 2
                                ? "scale-105"
                                : "scale-110"
                            } transition-transform`}
                          >
                            <TopperCards student={student} />
                          </div>
                        </div>
                      ))}
                      {/* Fill empty slots to center cards if partial slide (desktop/tablet only) */}
                      {slide.length < cardsPerView && Array.from({ length: cardsPerView - slide.length }).map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="flex-1 hidden md:block"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* Navigation Arrows */}
              <button
                onClick={goPrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full border border-red-200 bg-white/90 shadow-lg hover:bg-red-100 hover:border-red-400 focus:ring-2 focus:ring-red-300 transition-all duration-200 w-12 h-12 sm:w-14 sm:h-14 group"
                aria-label="Previous"
                style={{
                  display: numSlides > 1 ? undefined : "none",
                }}
              >
                <svg className="w-7 h-7 text-red-500 group-hover:scale-110 group-active:scale-95 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full border border-red-200 bg-white/90 shadow-lg hover:bg-red-100 hover:border-red-400 focus:ring-2 focus:ring-red-300 transition-all duration-200 w-12 h-12 sm:w-14 sm:h-14 group"
                aria-label="Next"
                style={{
                  display: numSlides > 1 ? undefined : "none",
                }}
              >
                <svg className="w-7 h-7 text-red-500 group-hover:scale-110 group-active:scale-95 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 pb-2 sm:pb-4">
                {Array.from({ length: numSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-red-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400/60
                      ${
                        currentIndex === idx
                          ? "bg-gradient-to-r from-red-500 to-pink-400 scale-110 sm:scale-125 shadow-lg shadow-pink-400/30 border-red-500"
                          : "bg-white hover:bg-red-100"
                      }
                    `}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MeetOurToppers;
