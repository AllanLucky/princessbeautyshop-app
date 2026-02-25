import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const AboutUsReadme = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-8 py-16">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">

        {/* Hero Banner */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80"
            alt="About Us Banner"
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center drop-shadow-lg">
              About Us - Full Story
            </h1>
            <Link to="/">
              <button className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-md transition">
                ✕
              </button>
            </Link>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-8 sm:p-12 space-y-12">

          {/* Mission */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Welcome to <span className="font-semibold text-indigo-600">Our Company</span>, where we aim to combine innovation, creativity, and quality in every service we provide. 
              Our mission is to deliver outstanding solutions while maintaining transparency and integrity in all our operations.
            </p>
          </section>

          {/* Vision */}
          <section className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our journey started with a vision to transform how people interact with our products and services. 
              Over the years, we have expanded our offerings while staying true to our values: excellence, commitment, and client satisfaction.
            </p>
          </section>

          {/* Team */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Our Team</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our team consists of skilled professionals, each bringing unique expertise and passion. 
              We work collaboratively to ensure every project exceeds expectations, and we take pride in the relationships we build with our clients and community.
            </p>
          </section>

          {/* Commitment */}
          <section className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaCheckCircle className="text-indigo-600" /> Our Commitment
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Join us on this journey as we continue to innovate, improve, and provide the best experiences possible. 
              Your trust drives our dedication and motivates us to push boundaries.
            </p>
          </section>

          {/* Call-to-Action */}
          <div className="text-center mt-6">
            <Link to="/">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition transform hover:-translate-y-1">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsReadme;