"use client";
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FaCheckCircle } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CustomHeading from "@/components/Heading/CustomHeading";

const AboutUsSectionTwo = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full max-w-screen-xl mx-auto flex justify-center items-center flex-col"
    >
      <CustomHeading
        title={"About Our Tutoring Center"}
        top={`top-[140%]`}
        padding={`py-24`}
        borderColour={"border-white"}
      />
      <div
        ref={ref}
        className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:pt-48"
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              number: "1500+",
              text: "Students Taught",
              color: "bg-blue-50",
              textColor: "text-blue-600",
            },
            {
              number: "95%",
              text: "Success Rate",
              color: "bg-purple-50",
              textColor: "text-purple-600",
            },
            {
              number: "15+",
              text: "Years Experience",
              color: "bg-green-50",
              textColor: "text-green-600",
            },
            {
              number: "20+",
              text: "Expert Teachers",
              color: "bg-orange-50",
              textColor: "text-orange-600",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              variants={{ visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className={`${item.color} p-6 text-center border-0`}>
                <h3 className={`${item.textColor} text-2xl font-bold`}>
                  {item.number}
                </h3>
                <p className="text-gray-700">{item.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {[
          {
            title: "Comprehensive Education",
            text: "Founded with a vision to provide quality education, our tutoring center specializes in comprehensive academic support for students from grades 5 through 12, covering both Science and Commerce streams.",
          },
          {
            title: "Expert Faculty",
            text: "Our team consists of experienced educators who are subject matter experts, dedicated to helping students achieve academic excellence through personalized attention and innovative teaching methods.",
          },
          {
            title: "Our Commitment",
            text: "",
            list: [
              "Personalized attention to each student",
              "Regular progress tracking",
              "Interactive learning sessions",
              "Regular parent-teacher meetings",
            ],
          },
          {
            title: "Teaching Approach",
            text: "We believe in an interactive learning environment that combines traditional teaching methods with modern technology to ensure better understanding and retention of concepts.",
          },
          {
            title: "Custom study material",
            text: "We provide custom study materials tailored to each student's needs, ensuring they have the resources necessary to excel in their studies. We also try to teach our students out of the box.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            variants={{ visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <Card className="bg-gray-50 p-6 border-0">
              <h2 className="text-xl font-bold">{item.title}</h2>
              {item.text && <p className="text-gray-700 mt-2">{item.text}</p>}
              {item.list && (
                <ul className="mt-2 space-y-2">
                  {item.list.map((listItem, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-green-500 mr-2" />{" "}
                      {listItem}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutUsSectionTwo;
