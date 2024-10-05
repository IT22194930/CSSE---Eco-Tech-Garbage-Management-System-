import React, { useState, useEffect } from "react";
import Scroll from "../../hooks/useScroll";
import useUser from "../../hooks/useUser";
import { Link } from "react-router-dom";

const GarbageRequest = () => {
  return (
    <>
      <div className="mt-20 mx-auto max-w-4xl p-6 bg-white dark:bg-slate-900 dark:shadow-slate-500 dark:mt-25 shadow-lg rounded-lg">
        <Scroll />
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center dark:text-white">
          Special Waste Collection Request
        </h1>
        <div className="flex justify-center">
          <Link to="/scheduleRequest">
            <button className="bg-secondary rounded-xl p-5 text-white px-20 hover:scale-105 duration-300">
              Schedule
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default GarbageRequest;
