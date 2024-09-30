import React from "react";

import bgImg from "../../../assets/banner-1.jpg";
import { Link, NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className="min-h-screen bg-cover"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="min-h-screen flex justify-start pl-11 items-center text-white bg-black bg-opacity-50">
        <div>
          <div className="space-y-4">
            <p className="md:text-4xl text-2xl">Cultivating a</p>
            <h1 className="md:text-7xl text-4xl font-bold">
              Brighter Future Together
            </h1>

            <div className="md:w-1/2">
              <p>
                Empowering farmers with innovative solutions and expert
                guidance. From soil testing to sustainable farming practices, we
                provide comprehensive services to help you achieve success in
                the field.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Link to={'/login'}>
              <button className="px-7 py-3 rounded-lg bg-secondary font-bold uppercase hover:scale-105 duration-300">
                Join Today
              </button>
              </Link>
              <NavLink to={'/services'}>
                <button className="px-7 py-3 rounded-lg border hover:bg-secondary font-bold uppercase">
                  Explore Our Services
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
