import React from "react";
import { Link } from "react-router-dom";

const CostCalculatorSection = () => {
  return (
    <div className="md:w-[80%] mx-auto my-28 px-6 lg:px-0">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
          Start Your Farming Journey
        </h1>
        <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">
          Estimate costs and plan resources for your plantation. Get personalized advice on water and fertilizer management based on your location’s unique conditions.
        </p>
        <Link to="/costCalculator">
          <div className="mt-8 bg-secondary rounded-md text-white font-bold hover:scale-125 transition-transform duration-300 hover:shadow-lg py-3 px-6 inline-block">
            Calculate Now
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CostCalculatorSection;
