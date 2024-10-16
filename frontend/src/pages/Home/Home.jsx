import React from "react";
import HeroContainer from "./Hero/HeroContainer";
import Gallery from "./Gallery/Gallery";
import GarbageRequestsSection from "./Schedule Garbage Request/GarbageRequestsSection";
import Scroll from "../../hooks/useScroll";

const Home = () => {
  return (
    <section>
      <Scroll/>
      <HeroContainer />

      <div className="max-w-screen-xl mx-auto">
        <GarbageRequestsSection />
      </div>

      <div className="max-w-screen-xl mx-auto">
        <Gallery />
      </div>
    </section>
  );
};

export default Home;
