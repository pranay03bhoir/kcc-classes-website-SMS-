"use client";
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
import React from "react";

const testimonials = [
  {
    id: 1,
    name: "Pranay Bhoir",
    role: "Class 12 Science Student",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    rating: 5,
    testimonial:
      "I am very happy with the teaching methods at the institute. The faculty is very supportive and helpful. The teaching methodology here is excellent. I improved my Physics and Mathematics significantly. The teachers are very supportive and always available for doubt clearing.",
  },
  {
    id: 2,
    name: "Sarah Sharma",
    role: "Class 11 Commerce Student",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    testimonial:
      "The personalized attention and regular doubt-solving sessions have helped me excel in my studies. The teachers are extremely knowledgeable and make complex topics easy to understand.",
  },
  {
    id: 3,
    name: "Rahul Patel",
    role: "Class 10 Student",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    testimonial:
      "The study material and regular tests have helped me build a strong foundation. The teachers are very approachable and always ready to help.",
  },
  {
    id: 4,
    name: "Priya Gupta",
    role: "Class 12 Arts Student",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    testimonial:
      "The institute has helped me discover my potential. The teachers are dedicated and the learning environment is very supportive.",
  },
  {
    id: 5,
    name: "Aryan Singh",
    role: "Class 11 Science Student",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 5,
    testimonial:
      "The practical approach to teaching and regular mock tests have prepared me well for my exams. I'm grateful for the guidance I've received here.",
  },
];

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

const CommentsCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

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
            {testimonials.map((testimonial) => (
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
                                  : "fill-gray-200 text-gray-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-center italic leading-relaxed">
                        "{testimonial.testimonial}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="relative static md:static size-12 cursor-pointer border-2 border-gray-200 hover:border-red-500 transition-colors" />
            <CarouselNext className="relative static md:static size-12 cursor-pointer border-2 border-gray-200 hover:border-red-500 transition-colors" />
          </div>
        </Carousel>
      </div>
    </motion.div>
  );
};

export default CommentsCarousel;
