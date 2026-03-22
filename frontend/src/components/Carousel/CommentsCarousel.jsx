"use client";
import { getPublicTestimonials } from "@/api/testimonials";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Helper to trim testimonial text to maxLen chars, not splitting words
function trimTestimonial(text, maxLen = 100) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  let trimmed = text.slice(0, maxLen);
  // Attempt to trim at a word boundary if possible, but fallback to blunt cut
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace > maxLen - 25) {
    trimmed = trimmed.slice(0, lastSpace);
  }
  return trimmed.trim() + "…";
}

const CommentsCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  // State to manage expanded testimonials by testimonial id
  const [expandedIds, setExpandedIds] = useState({});

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadError(null);
      try {
        const list = await getPublicTestimonials();
        if (!cancelled) {
          // Save full testimonial text separately.
          // Store both full and trimmed version for each testimonial.
          const prepared = Array.isArray(list)
            ? list.map((t) => {
                const fullText = t.testimonial || "";
                const trimmed = trimTestimonial(fullText, 100);
                const isTrimmed = trimmed !== fullText;
                return {
                  ...t,
                  _testimonialFull: fullText,
                  _testimonialTrimmed: trimmed,
                  _testimonialIsTrimmed: isTrimmed,
                };
              })
            : [];
          setTestimonials(prepared);
        }
      } catch (err) {
        if (!cancelled) {
          setTestimonials([]);
          setLoadError(
            err.response?.data?.message ||
              err.message ||
              "Could not load testimonials. Check that the API server is running.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle toggling expansion per testimonial
  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="w-full py-12 px-4 md:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Students Say
        </h2>

        {loading && (
          <p className="text-center text-gray-500 py-8">Loading testimonials…</p>
        )}

        {!loading && loadError && (
          <p className="text-center text-amber-800 bg-amber-50 border border-amber-200 rounded-lg max-w-xl mx-auto py-4 px-4 text-sm">
            {loadError}
          </p>
        )}

        {!loading && !loadError && testimonials.length === 0 && (
          <p className="text-center text-gray-500 max-w-xl mx-auto py-8">
            Student testimonials will appear here once they are shared from
            student accounts.
          </p>
        )}

        {!loading && !loadError && testimonials.length > 0 && (
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => {
                const isExpanded = !!expandedIds[testimonial.id];
                const needsTruncate = testimonial._testimonialIsTrimmed;
                const textToShow =
                  isExpanded || !needsTruncate
                    ? testimonial._testimonialFull
                    : testimonial._testimonialTrimmed;
                return (
                  <CarouselItem
                    key={testimonial.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      variants={fadeInUp}
                      className="h-full"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="h-full bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="flex flex-col items-center gap-6 p-6">
                          <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 opacity-10 blur-sm" />
                            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-red-500">
                              <img
                                src={testimonial.image}
                                alt={`${testimonial.name}'s profile picture`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          </div>
                          <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {testimonial.role}
                            </p>
                            <div className="flex justify-center gap-1 mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < testimonial.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-gray-700 text-center italic leading-relaxed">
                            <span>
                              &ldquo;{textToShow}&rdquo;
                            </span>
                            {needsTruncate && (
                              <button
                                type="button"
                                onClick={() => toggleExpand(testimonial.id)}
                                className={cn(
                                  "ml-2 text-red-600 font-medium underline text-sm",
                                  "focus:outline-none focus:ring-2 focus:ring-red-300"
                                )}
                                aria-expanded={isExpanded}
                              >
                                {isExpanded ? "Read less" : "Read more"}
                              </button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static size-12 cursor-pointer border-2 border-gray-200 hover:border-red-500 transition-colors" />
              <CarouselNext className="static size-12 cursor-pointer border-2 border-gray-200 hover:border-red-500 transition-colors" />
            </div>
          </Carousel>
        )}
      </div>
    </motion.div>
  );
};

export default CommentsCarousel;
