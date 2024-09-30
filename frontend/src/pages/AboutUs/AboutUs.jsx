import React from "react";
import Scroll from "../../hooks/useScroll";

const AboutUs = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 mt-10">
      <Scroll/>
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          About Us
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Learn more about our mission, values, and the dedicated team behind
          our efforts to support sustainable agriculture and empower farmers.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Our Mission
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          At AgriPeace, our mission is to transform agriculture through innovation and sustainability. We strive to support farmers with cutting-edge solutions and insights, enabling them to achieve higher yields while maintaining ecological balance. Our commitment is to create a positive impact on the agricultural industry and contribute to the betterment of farming communities worldwide.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Our Values
        </h2>
        <ul className="list-disc list-inside space-y-4 text-gray-700 dark:text-gray-300">
          <li><strong>Innovation:</strong> We are dedicated to developing and implementing innovative solutions to address the evolving needs of agriculture.</li>
          <li><strong>Sustainability:</strong> We believe in promoting sustainable practices that protect the environment and ensure long-term agricultural productivity.</li>
          <li><strong>Integrity:</strong> We conduct our business with the highest standards of integrity, ensuring transparency and trust in all our interactions.</li>
          <li><strong>Collaboration:</strong> We work closely with farmers, stakeholders, and partners to achieve common goals and drive positive change in the industry.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:scale-105 duration-300">
            <img src="./team-member-1.jpg" alt="Team Member" className="w-full h-40 object-cover rounded-lg mb-4"/>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              John Doe
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Founder & CEO
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:scale-105 duration-300">
            <img src="./team-member-2.jpg" alt="Team Member" className="w-full h-40 object-cover rounded-lg mb-4"/>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Jane Smith
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Head of Research & Development
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:scale-105 duration-300">
            <img src="./team-member-3.jpg" alt="Team Member" className="w-full h-40 object-cover rounded-lg mb-4"/>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Michael Johnson
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Operations Manager
            </p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Join Us on Our Journey
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We invite you to be part of our mission to revolutionize agriculture. Whether you're a farmer, partner, or supporter, there's a place for you in our community. Connect with us and let's work together towards a more sustainable and prosperous future.
        </p>
        <a href="/contact">
          <button className="bg-secondary text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-all duration-300">
            Get in Touch
          </button>
        </a>
      </section>
    </div>
  );
};

export default AboutUs;
