"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
const carouselItems = [
  {
    image: "/images/teacher-teaching.jpg",
    title: "Excel in Your Studies with",
    subtitle: "Expert Tutoring",
    description:
      "Comprehensive tutoring for grades 5-12 in Science and Commerce streams. Personalized attention, expert faculty, and proven results.",
    gradient: "from-blue-900/80 to-red-900/80",
    alignment: "items-center",
  },
  {
    image: "/images/KCC-CLASSES.png",
    title: "Personalized Learning",
    subtitle: "For Every Student",
    description:
      "Individual attention and customized study plans tailored to your learning style. Small batch sizes ensure focused guidance.",
    gradient: "from-purple-900/80 to-indigo-900/80",
    alignment: "items-start md:items-center",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    title: "Modern Facilities",
    subtitle: "State-of-the-art Learning",
    description:
      "Experience learning in our well-equipped classrooms with the latest technology and resources to enhance your education.",
    gradient: "from-emerald-900/80 to-teal-900/80",
    alignment: "items-end md:items-center",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
    title: "Success Stories",
    subtitle: "Join Our Community",
    description:
      "Be part of our growing community of achievers. Our students consistently excel in board exams and competitive tests.",
    gradient: "from-rose-900/80 to-orange-900/80",
    alignment: "items-center",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HomeIntroScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState(null);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  // Sync currentIndex with Embla's selected snap
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Go to slide and reset autoplay
  const scrollTo = (idx) => {
    if (emblaApi) {
      emblaApi.scrollTo(idx);
      if (plugin.current && plugin.current.reset) plugin.current.reset();
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative min-h-screen max-h-screen h-[100vh] overflow-hidden group bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f3460]"
    >
      {/* Animated overlay for depth */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="w-full h-full animate-gradient-x bg-gradient-to-r from-[#ff512f]/10 via-[#dd2476]/10 to-[#1a1a2e]/10" />
      </div>
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full h-full"
        opts={{
          loop: true,
          align: "center",
          containScroll: "trimSnaps",
        }}
        setApi={setEmblaApi}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div
                className={`relative w-full h-[100vh] min-h-[400px] max-h-screen flex ${item.alignment} justify-center px-2 md:px-4 lg:px-8`}
              >
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} z-10`}
                  />
                  <motion.img
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center max-h-screen"
                    style={{ minHeight: "400px" }}
                  />
                </div>

                {/* Content Container with glassmorphism */}
                <div className="relative z-20 w-full max-w-[700px] mx-auto py-10 md:py-16 flex flex-col justify-center h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="space-y-6 md:space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-7 md:p-12 border border-white/20 flex flex-col justify-center"
                    >
                      {/* Text Content */}
                      <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto text-center">
                        <motion.h1
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ duration: 0.5, delay: 0.15 }}
                          className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-lg"
                        >
                          {item.title}
                        </motion.h1>
                        <motion.h2
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ duration: 0.5, delay: 0.22 }}
                          className="text-2xl md:text-4xl lg:text-5xl font-bold text-pink-300 leading-tight drop-shadow"
                        >
                          {item.subtitle}
                        </motion.h2>
                        <motion.p
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto text-gray-100"
                        >
                          {item.description}
                        </motion.p>
                      </div>

                      {/* Buttons */}
                      <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="flex flex-col md:flex-row justify-center items-center gap-6 pt-2 md:pt-4"
                      >
                        <motion.button
                          whileHover={{
                            scale: 1.09,
                            boxShadow:
                              "0 8px 32px 0 #ff512f88, 0 0 0 6px #fff3",
                            y: -3,
                            background:
                              "linear-gradient(90deg,#ff6a00,#ee0979)",
                          }}
                          whileTap={{ scale: 0.97 }}
                          className="px-10 py-4 bg-gradient-to-r from-[#ff6a00] via-[#ff512f] to-[#ee0979] text-white rounded-2xl h-16 md:w-52 w-full cursor-pointer text-lg font-bold shadow-2xl border border-white/30 transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-400/60"
                          style={{
                            boxShadow:
                              "0 4px 24px 0 #ff512f44, 0 2px 8px 0 #fff1, 0 0 12px 2px #ff6a0033 inset",
                            borderBottom: "4px solid #ee0979",
                          }}
                        >
                          <span className="whitespace-nowrap flex items-center">
                            Get Started <ChevronRight className="ml-2" />
                          </span>
                        </motion.button>
                        <Link href="/aboutus" className="w-full md:w-auto">
                          <motion.button
                            whileHover={{
                              scale: 1.09,
                              boxShadow: "0 8px 32px 0 #fff8, 0 0 0 6px #fff3",
                              y: -3,
                              background: "linear-gradient(90deg,#fff,#f8fafc)",
                              color: "#ee0979",
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="px-10 py-4 text-white border-2 border-white/80 rounded-2xl h-16 md:w-52 w-full cursor-pointer text-lg font-bold shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 bg-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-pink-400/60 whitespace-nowrap"
                            style={{
                              boxShadow:
                                "0 4px 24px 0 #fff2, 0 2px 8px 0 #fff1, 0 0 12px 2px #fff6 inset",
                              borderBottom: "4px solid #fff6",
                            }}
                          >
                            <span className="whitespace-nowrap flex items-center">
                              Learn More <ChevronRight className="ml-2" />
                            </span>
                          </motion.button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between items-center px-4 md:px-8 lg:px-16 pointer-events-none">
          {/* Left Arrow */}
          <div className="pointer-events-auto">
            <CarouselPrevious
              className="relative static size-12 md:size-14 lg:size-16 cursor-pointer border-2 border-white/30 hover:border-white transition-all duration-300 bg-black/30 hover:bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 shadow-lg hover:shadow-pink-400/40"
              onClick={() => {
                scrollTo(
                  (currentIndex - 1 + carouselItems.length) %
                    carouselItems.length
                );
              }}
            >
              <ChevronLeft className="size-6 md:size-7 lg:size-8" />
              <span className="sr-only">Previous slide</span>
            </CarouselPrevious>
          </div>

          {/* Right Arrow */}
          <div className="pointer-events-auto">
            <CarouselNext
              className="relative static size-12 md:size-14 lg:size-16 cursor-pointer border-2 border-white/30 hover:border-white transition-all duration-300 bg-black/30 hover:bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 shadow-lg hover:shadow-pink-400/40"
              onClick={() => {
                scrollTo((currentIndex + 1) % carouselItems.length);
              }}
            >
              <ChevronRight className="size-6 md:size-7 lg:size-8" />
              <span className="sr-only">Next slide</span>
            </CarouselNext>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4 px-4">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`size-4 md:size-5 rounded-full border-2 border-white/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/60
                ${
                  currentIndex === idx
                    ? "bg-gradient-to-r from-[#ff512f] to-[#dd2476] scale-125 shadow-lg shadow-pink-400/30"
                    : "bg-white/40 hover:bg-white/70"
                }
              `}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                boxShadow:
                  currentIndex === idx ? "0 0 0 4px #ff512f33" : undefined,
              }}
            />
          ))}
        </div>
      </Carousel>
    </motion.div>
  );
};

export default HomeIntroScreen;
