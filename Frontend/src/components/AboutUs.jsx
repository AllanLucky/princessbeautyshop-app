import React, { useState, useEffect } from "react";
import { userRequest } from "../requestMethod";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const navigate = useNavigate();

  // Fetch about data from database
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await userRequest.get("/about");
        const data = response.data;
        
        setAboutData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch about data:", error);
        // Fallback data
        setAboutData({
          companyName: "Kilifonia Beauty",
          tagline: "Experience the transformative power",
          mission: "To provide innovative, high-quality beauty products that empower individuals to express their unique beauty with confidence.",
          vision: "A world where everyone feels beautiful in their own skin, supported by products that are both effective and ethically produced.",
          story: "Kilifonia Beauty was born from a simple yet powerful idea: beauty should be accessible, transparent, and effective. Founded in 2020, we've grown from a small startup to a trusted name in the beauty industry, known for our commitment to quality and innovation.",
          services: [
            {
              title: "Skincare Timetable Creation",
              description: "Personalized daily skincare routines tailored to your skin type, concerns, and lifestyle for optimal results.",
              features: ["Custom morning & evening routines", "Seasonal adjustments", "Progress tracking", "Expert recommendations"]
            },
            {
              title: "Free Skin Assessment",
              description: "Professional skin analysis to identify your unique needs and recommend the perfect products for your skin.",
              features: ["Detailed skin type analysis", "Concern-specific solutions", "Product recommendations", "Follow-up support"]
            },
            {
              title: "Retail & Wholesale",
              description: "Purchase individual products for personal use or partner with us for wholesale opportunities.",
              features: ["Single product purchases", "Bulk ordering options", "Business partnerships", "Custom branding available"]
            },
            {
              title: "Beauty Packages",
              description: "Choose from our expertly curated packages or create your own custom beauty regimen.",
              features: ["Premade skincare sets", "Custom package builder", "Themed collections", "Subscription options"]
            }
          ],
          values: [
            {
              title: "Personalization",
              description: "Every solution is tailored to your unique beauty needs and preferences."
            },
            {
              title: "Expert Guidance",
              description: "Professional recommendations based on scientific research and beauty expertise."
            },
            {
              title: "Flexibility",
              description: "Multiple purchasing options from single products to comprehensive packages."
            },
            {
              title: "Quality Assurance",
              description: "All products undergo rigorous testing to ensure safety and effectiveness."
            }
          ]
        });
        setIsLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);

  // Show welcome popup on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedAbout');
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
        localStorage.setItem('hasVisitedAbout', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeWelcomePopup = () => {
    setShowWelcomePopup(false);
  };

  const handleCreateTimetable = () => {
    navigate("/timetable");
  };

  const handleSkinAssessment = () => {
    navigate("/skin-clinic");
  };

  const handleExploreProducts = () => {
    navigate("/products/skincare");
  };

  const handleCreatePackage = () => {
    navigate("/packages");
  };

  const handleWholesaleInquiry = () => {
    navigate("/products/skincare");
  };

  if (isLoading) {
    return (
      <section className="bg-gradient-to-r from-pink-100 via-white to-pink-50 py-24 px-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading our story...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden transform animate-scale-in border-2 border-white/20 backdrop-blur-sm">
            {/* Close Button */}
            <button
              onClick={closeWelcomePopup}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-300 shadow-lg border border-pink-200 hover:scale-110"
            >
              <span className="text-gray-700 text-xl font-light">×</span>
            </button>
            
            {/* Large GIF Section */}
            <div className="relative h-80 bg-gradient-to-r from-pink-400 to-purple-500 overflow-hidden">
              <img 
                src="https://res.cloudinary.com/dkdx7xytz/image/upload/v1772473704/Allanb_uvnmkk.gif"
                alt="Discover Kilifonia Beauty"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content Section */}
            <div className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3 text-center font-playfair">
                Welcome to Kilifonia Beauty
              </h3>
              
              <p className="text-gray-700 mb-6 text-center text-base leading-relaxed font-inter">
                Discover personalized beauty solutions tailored just for you. Start your journey to radiant skin today.
              </p>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleCreateTimetable}
                  className="bg-white border-2 border-pink-200 text-pink-700 py-3 px-2 rounded-lg font-semibold hover:bg-pink-50 transition-all text-sm text-center font-inter"
                >
                  Create Skincare Timetable
                </button>
                <button
                  onClick={handleSkinAssessment}
                  className="bg-white border-2 border-purple-200 text-purple-700 py-3 px-2 rounded-lg font-semibold hover:bg-purple-50 transition-all text-sm text-center font-inter"
                >
                  Free Skin Assessment
                </button>
              </div>

              {/* Main Action Button */}
              <button
                onClick={closeWelcomePopup}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg border-2 border-white/20 text-lg font-inter"
              >
                Explore Our Services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main About Content */}
      <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-100 via-white to-pink-50 py-20 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-playfair">
              About <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> Kilifonia Beauty</span>
            </h1>
            <p className="text-2xl text-gray-700 mb-8 font-inter italic">
              {aboutData.tagline}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-12"></div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 font-playfair">Our Mission</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed font-inter">
                {aboutData.mission}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 font-playfair">Our Vision</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed font-inter">
                {aboutData.vision}
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 font-playfair">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {aboutData.services.map((service, index) => (
                <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed font-inter">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600 font-inter">
                        <svg className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {index === 0 && (
                      <button 
                        onClick={handleCreateTimetable}
                        className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition transform hover:scale-105 font-semibold font-inter"
                      >
                        Create Timetable
                      </button>
                    )}
                    {index === 1 && (
                      <button 
                        onClick={handleSkinAssessment}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition transform hover:scale-105 font-semibold font-inter"
                      >
                        Start Assessment
                      </button>
                    )}
                    {index === 2 && (
                      <div className="flex gap-3">
                        <button 
                          onClick={handleExploreProducts}
                          className="px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition transform hover:scale-105 font-semibold text-sm font-inter"
                        >
                          Shop Retail
                        </button>
                        <button 
                          onClick={handleWholesaleInquiry}
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition transform hover:scale-105 font-semibold text-sm font-inter"
                        >
                          Wholesale Info
                        </button>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="flex gap-3">
                        <button 
                          onClick={handleExploreProducts}
                          className="px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition transform hover:scale-105 font-semibold text-sm font-inter"
                        >
                          View Premade
                        </button>
                        <button 
                          onClick={handleCreatePackage}
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition transform hover:scale-105 font-semibold text-sm font-inter"
                        >
                          Create Custom
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 font-playfair">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutData.values.map((value, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-50 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-4 font-playfair">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed font-inter">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default About;