import React from "react";
import {
  FaTractor,
  FaSeedling,
  FaLeaf,
  FaWater,
  FaTree,
  FaUserGraduate,
} from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { NavLink } from "react-router-dom";
import Scroll from "../../hooks/useScroll";

const services = [
  {
    title: "Soil Testing and Analysis",
    description:
      "Get comprehensive insights into the nutrient composition and quality of your soil.",
    icon: <FaSeedling />,
    details: `Our soil testing service provides a thorough analysis of the soil's physical and chemical properties. This includes testing for nutrient levels, pH balance, and organic matter content. By understanding your soil's characteristics, you can make informed decisions about fertilization and crop selection. Our experts also provide personalized recommendations to enhance soil fertility and structure, helping you achieve optimal crop yields.`,
  },
  {
    title: "Crop Consultation and Planning",
    description:
      "Expert guidance on crop selection and farming strategies for maximum yield.",
    icon: <FaLeaf />,
    details: `Our crop consultation service offers valuable insights into selecting the best crops for your specific environment and market conditions. We provide tailored advice on planting schedules, crop rotation, pest management, and sustainable practices. Our goal is to help you maximize productivity while maintaining ecological balance. We also assist with integrating modern farming technologies and methodologies to enhance efficiency and profitability.`,
  },
  {
    title: "Farm Equipment Rental and Maintenance",
    description:
      "Affordable and reliable farm equipment rentals with full maintenance support.",
    icon: <FaTractor />,
    details: `We offer a wide range of farm equipment, from tractors and plows to harvesters and seeders. Our equipment rental service is designed to provide farmers with access to the latest machinery without the high costs of ownership. All our equipment is regularly serviced and maintained to ensure peak performance. Additionally, our team provides on-site support and maintenance services to minimize downtime and keep your operations running smoothly.`,
  },
  {
    title: "Irrigation and Water Management",
    description:
      "Efficient irrigation solutions to optimize water usage and crop growth.",
    icon: <FaWater />,
    details: `Effective water management is crucial for successful farming. Our irrigation services include the design and installation of various systems such as drip irrigation, sprinklers, and surface irrigation. We provide customized solutions based on your farm's specific needs, soil type, and crop requirements. Our experts also offer guidance on water conservation techniques and best practices to ensure sustainable water use and enhance crop productivity.`,
  },
  {
    title: "Agroforestry and Sustainable Farming",
    description:
      "Integrating trees into farming for biodiversity and sustainability.",
    icon: <FaTree />,
    details: `Agroforestry combines agriculture and forestry to create more diverse, productive, and sustainable land-use systems. By integrating trees and shrubs into your farm, you can improve soil health, enhance biodiversity, and provide additional sources of income. Our agroforestry services include planning and design, species selection, and management practices. We help you implement systems that benefit both your crops and the environment, creating a balanced and resilient ecosystem.`,
  },
  {
    title: "Training and Educational Programs",
    description:
      "Comprehensive training on modern and sustainable agricultural practices.",
    icon: <FaUserGraduate />,
    details: `Our training programs cover a wide range of topics, including organic farming, pest management, and the use of technology in agriculture. We offer both theoretical knowledge and practical skills through workshops, seminars, and online courses. Our experienced instructors provide hands-on training and real-world examples to help farmers apply the latest techniques and innovations. Whether you're a beginner or an experienced farmer, our programs are designed to enhance your knowledge and skills.`,
  },
];

const Services = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 mt-10">
      <Scroll/>
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Our Services
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We are dedicated to providing a comprehensive range of services to
          support farmers and promote sustainable agricultural practices.
          Discover how we can help you optimize your farming operations and
          achieve success.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <span className="text-3xl text-green-600">{service.icon}</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {service.title}
            </h2>
            <p className="text-gray-700 mb-4">{service.description}</p>
            <details
              className="text-gray-700 cursor-pointer group overflow-hidden"
              open={false} // Initially closed
            >
              <summary className="flex items-center">
                <span className="text-green-600 hover:text-green-800 transition-all duration-300">
                  Read more
                </span>
                <IoMdArrowDropright className="ml-1 text-green-600 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-2 transition-all duration-300 ease-in-out max-h-0 group-open:max-h-[200px] overflow-auto">
                {service.details}
              </p>
            </details>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8 dark:text-white">
          What Our Clients Say
        </h2>
        <div className="flex justify-center">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <p className="text-gray-700 italic">
                "The soil testing service was a game-changer for our farm. We
                were able to improve our soil health significantly and saw a
                substantial increase in our crop yields."
              </p>
              <p className="text-right mt-4 text-gray-900 font-semibold">
                - Farmer John
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <p className="text-gray-700 italic">
                "The crop consultation helped us choose the best crops for our
                climate and market. Their expert advice and support have been
                invaluable."
              </p>
              <p className="text-right mt-4 text-gray-900 font-semibold">
                - Farmer Lisa
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-300">
          Contact us today to learn more about our services and how we can help
          you achieve your farming goals. Our team of experts is here to support
          you every step of the way.
        </p>
        <NavLink to={'/contact'}>
          <button className="inline-block bg-secondary text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-all duration-300">
            Contact Us
          </button>
        </NavLink>
      </section>
    </div>
  );
};

export default Services;
