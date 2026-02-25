import React, { useState } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! Thank you.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-8 py-16">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Hero Banner */}
        <div className="relative w-full">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1350&q=80"
            alt="Contact Us Banner"
            className="w-full min-h-[250px] sm:min-h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg text-center">
              Contact Us
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">
              Have a question? Reach out to us using the form below and we will
              respond promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 h-44 focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none"
                required
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-lg transition transform hover:-translate-y-1"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800">Get in Touch</h2>
            <p className="text-gray-600 text-lg">
              You can also reach us directly through the following:
            </p>

            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-indigo-600 text-xl mt-1" />
              <p className="text-gray-700">123 BeautyBliss Kenyatta Ave, Nairobi, Kenya</p>
            </div>

            <div className="flex items-start gap-4">
              <FaEnvelope className="text-indigo-600 text-xl mt-1" />
              <p className="text-gray-700">info@beautybliss.com</p>
            </div>

            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-indigo-600 text-xl mt-1" />
              <p className="text-gray-700">+254 788425000</p>
            </div>

            <p className="text-gray-500 mt-4">
              We are available Monday to Friday, 9:00 AM - 6:00 PM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;