import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-8 py-16">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">

        {/* Hero Section */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80"
            alt="About Us"
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center drop-shadow-lg">
              About Us
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            Welcome to <span className="font-semibold text-indigo-600">Our Company</span>, where innovation meets quality. 
            We are passionate about delivering the best products and services to our customers worldwide.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Our team is composed of skilled professionals dedicated to exceeding expectations, 
            providing seamless experiences, and fostering a community of happy clients. 
            Transparency, commitment, and excellence are at the heart of everything we do.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Join us on our journey to make life easier and more enjoyable. 
            Your satisfaction drives our passion.
          </p>

          {/* Read More Button */}
          <div className="mt-6">
            <Link to="/about-us-readme">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition transform hover:-translate-y-1">
                Read More →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;