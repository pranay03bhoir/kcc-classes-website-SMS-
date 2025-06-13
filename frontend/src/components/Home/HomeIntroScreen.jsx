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
import React, { useState } from "react";

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
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const handleSlideChange = (api) => {
    setCurrentIndex(api.selectedScrollSnap());
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative min-h-[85vh] overflow-hidden group"
    >
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
        onSelect={handleSlideChange}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div
                className={`relative w-full min-h-[85vh] flex ${item.alignment} justify-center px-4 md:px-8 lg:px-16`}
              >
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} z-10`}
                  />
                  <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content Container */}
                <div className="relative z-20 w-full max-w-[1400px] mx-auto py-16 md:py-24">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="space-y-8 md:space-y-10"
                    >
                      {/* Text Content */}
                      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
                        <motion.h1
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight"
                        >
                          {item.title}
                        </motion.h1>
                        <motion.h2
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="text-3xl md:text-5xl lg:text-6xl font-bold text-red-400 leading-tight"
                        >
                          {item.subtitle}
                        </motion.h2>
                        <motion.p
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-gray-100"
                        >
                          {item.description}
                        </motion.p>
                      </div>

                      {/* Buttons */}
                      <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col md:flex-row justify-center items-center gap-6 pt-4 md:pt-8"
                      >
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "#9f0712",
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="px-10 py-4 bg-red-600 text-white rounded-lg h-16 md:w-52 w-full cursor-pointer text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Get Started
                        </motion.button>
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "rgba(255,255,255,0.15)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="px-10 py-4 text-white border-2 border-white rounded-lg h-16 md:w-52 w-full cursor-pointer text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Learn More
                        </motion.button>
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
            <CarouselPrevious className="relative static size-12 md:size-14 lg:size-16 cursor-pointer border-2 border-white/30 hover:border-white transition-all duration-300 bg-black/20 hover:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
              <ChevronLeft className="size-6 md:size-7 lg:size-8" />
              <span className="sr-only">Previous slide</span>
            </CarouselPrevious>
          </div>

          {/* Right Arrow */}
          <div className="pointer-events-auto">
            <CarouselNext className="relative static size-12 md:size-14 lg:size-16 cursor-pointer border-2 border-white/30 hover:border-white transition-all duration-300 bg-black/20 hover:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
              <ChevronRight className="size-6 md:size-7 lg:size-8" />
              <span className="sr-only">Next slide</span>
            </CarouselNext>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-3 px-4">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`size-2.5 md:size-3 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </motion.div>
  );
};

export default HomeIntroScreen;
