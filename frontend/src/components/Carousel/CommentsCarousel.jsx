"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const CommentsCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );
  return (
    <div className={`flex justify-center pt-22`}>
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full md:max-w-5xl"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="bg-[#FAFBFB]">
                  <CardContent className="flex flex-col items-center gap-5">
                    <div className="w-20 h-20 border-2 border-dashed border-blue-500 rounded-full overflow-hidden">
                      <img
                        src="https://randomuser.me/api/portraits/men/34.jpg" // Replace with your actual image path
                        alt="Student"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold">Pranay Bhoir</h1>
                      <p>Class 12 Science Student</p>
                    </div>
                    <div>
                      <p>
                        "I am very happy with the teaching methods at the
                        institute. The faculty is very supportive and helpful."
                        <br></br>
                        "The teaching methodology here is excellent. I improved
                        my Physics and Mathematics significantly. The teachers
                        are very supportive and always available for doubt
                        clearing."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`hidden md:flex size-20 cursor-pointer`} />
        <CarouselNext className={`hidden md:flex size-20 cursor-pointer`} />
      </Carousel>
    </div>
  );
};

export default CommentsCarousel;
