import React from "react";

const HomeIntroScreen = () => {
  return (
    <div className="text-black text-center">
      <div className="text-4xl font-extrabold md:text-6xl lg:text-7xl px-5 md:px-0">
        <h1 className={``}>
          Excel in Your Studies with<br></br>
        </h1>
        <h1 className={` text-blue-600`}>Expert Tutoring</h1>
      </div>
      <p className="md:text-xl mt-5 text-lg text-center px-5 leading-7">
        Comprehensive tutoring for grades 5-12 in Science and Commerce streams.
        <br></br>
        Personalized attention, expert faculty, and proven results.
      </p>
      <div className="text-xl mt-6 md:flex md:flex-row md:justify-center gap-5 flex flex-col items-center px-4 ">
        <button className="md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition h-16 md:w-40 w-full cursor-pointer">
          Get Started
        </button>
        <button
          className={`md:px-4 md:py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-gray-50 transition-colors  h-16 md:w-40 w-full cursor-pointer`}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default HomeIntroScreen;
