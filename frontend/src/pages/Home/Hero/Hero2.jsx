import React from "react";

import bgImg from "../../../assets/banner-2.jpg";
import { Link } from "react-router-dom";

const Hero2 = () => {
  return (
    <div
      className="min-h-screen bg-cover"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="min-h-screen flex justify-start pl-11 items-center text-white bg-black bg-opacity-30">
        <div>
          <div className="space-y-4">
            <p className="md:text-4xl text-2xl">Sowing the Seeds of</p>
            <h1 className="md:text-7xl text-4xl font-bold">
              Innovation in Agriculture
            </h1>

            <div className="md:w-1/2">
              <p>
                Dedicated to providing farmers with cutting-edge tools and
                insights. Our comprehensive services range from precision
                farming techniques to expert crop planning, ensuring your farm
                thrives with maximum efficiency and sustainability.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Link to={'/login'}>
              <button className="px-7 py-3 rounded-lg bg-secondary font-bold uppercase hover:scale-105 duration-300">
                Join Today
              </button>
              </Link>
              <button className="px-7 py-3 rounded-lg border hover:bg-secondary font-bold uppercase">
                Discover Our Solutions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero2;
