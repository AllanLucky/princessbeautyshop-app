import React, { useState, useRef, useEffect } from "react";
import { userRequest } from "../requestMethod";
import { useNavigate } from "react-router-dom";
import { trackButtonClick } from "../utils/analytics";

const Banner = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [discovery, setDiscovery] = useState(null);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [bannerData, setBannerData] = useState(null);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const wheelRef = useRef(null);
  const navigate = useNavigate();

  // Product categories for discovery wheel
  const productCategories = [
    { name: "SKINCARE", searchTerm: "skincare", description: "Nourish your skin" },
    { name: "MAKEUP", searchTerm: "cosmetics", description: "Express your beauty" },
    { name: "HAIR CARE", searchTerm: "hair care", description: "Luscious locks" },
    { name: "BODY CARE", searchTerm: "body care", description: "Pamper yourself" },
    { name: "FRAGRANCE", searchTerm: "fragrance", description: "Signature scents" },
    { name: "WELLNESS", searchTerm: "wellness", description: "Inner glow" },
    { name: "MEN'S CARE", searchTerm: "men's care", description: "Grooming essentials" },
    { name: "ORGANIC", searchTerm: "organic", description: "Natural beauty" }
  ];

  // Default title options if not provided from backend
  const defaultTitleOptions = [
    "GOOD FOR SKIN",
    "PREMIUM QUALITY",
    "NATURAL INGREDIENTS",
    "BEAUTIFUL RESULTS"
  ];

  // Show popup when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch banner data from database
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await userRequest.get("/banners");
        const data = response.data;
        
        // Ensure we have proper banner data structure
        const bannerData = {
          gifUrl: data.gifUrl || "https://i.pinimg.com/originals/4f/05/f9/4f05f907a1486c47b69fac1d4ab1f3a4.gif",
          title: data.title || "GOOD FOR SKIN",
          subtitle: data.subtitle || "Experience the transformative power",
          description: data.description || "Experience the transformative power of our premium skincare and cosmetics, crafted with natural ingredients for visible results.",
          titleOptions: data.titleOptions || defaultTitleOptions
        };
        
        setBannerData(bannerData);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch banner data:", error);
        // Fallback data if fetch fails
        setBannerData({
          gifUrl: "https://i.pinimg.com/originals/4f/05/f9/4f05f907a1486c47b69fac1d4ab1f3a4.gif",
          title: "GOOD FOR SKIN",
          subtitle: "Experience the transformative power",
          description: "Experience the transformative power of our premium skincare and cosmetics, crafted with natural ingredients for visible results.",
          titleOptions: defaultTitleOptions
        });
        setIsLoading(false);
      }
    };
    
    fetchBannerData();
  }, []);

  // Improved typing animation effect
  useEffect(() => {
    if (!bannerData) return;

    let timeout;
    let charIndex = 0;
    
    const currentTitles = bannerData.titleOptions || defaultTitleOptions;
    const currentTitle = currentTitles[currentTitleIndex];

    const typeText = () => {
      if (charIndex <= currentTitle.length) {
        setDisplayedTitle(currentTitle.substring(0, charIndex));
        charIndex++;
        timeout = setTimeout(typeText, 100);
      } else {
        setIsTyping(false);
        // Wait before starting to delete
        timeout = setTimeout(() => {
          deleteText();
        }, 1500);
      }
    };

    const deleteText = () => {
      if (charIndex >= 0) {
        setDisplayedTitle(currentTitle.substring(0, charIndex));
        charIndex--;
        timeout = setTimeout(deleteText, 50);
      } else {
        // Move to next title after deletion completes
        setCurrentTitleIndex((prev) => (prev + 1) % currentTitles.length);
        setIsTyping(true);
      }
    };

    // Start the animation
    if (isTyping) {
      typeText();
    } else {
      deleteText();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [bannerData, currentTitleIndex, isTyping]);

  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowDiscovery(false);
    
    const spinDegrees = 1800 + Math.floor(Math.random() * 360);
    const discoveryIndex = Math.floor(Math.random() * productCategories.length);
    const discoveredCategory = productCategories[discoveryIndex];
    
    // Track spin start - IMPORTANT ACTION
    trackButtonClick("discovery_wheel_spin", {
      category: discoveredCategory.name,
      spinDegrees: spinDegrees
    });
    
    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)";
      wheelRef.current.style.transform = `rotate(${spinDegrees}deg)`;
    }
    
    setTimeout(() => {
      setIsSpinning(false);
      setDiscovery(discoveredCategory);
      setShowDiscovery(true);
      
      setTimeout(() => {
        navigate(`/products/${discoveredCategory.searchTerm}`);
      }, 2000);
    }, 4000);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleDiscoverProducts = () => {
    navigate("/products/skincare");
  };

  const handleLearnMore = () => {
    navigate("/about-us");
  };

  const handleCreateTimetable = () => {
    setShowPopup(false);
    
    // Track timetable creation - IMPORTANT ACTION
    trackButtonClick("create_skincare_timetable", {
      source: "welcome_popup"
    });
    
    navigate("/skincare-timetable");
  };

  const handleCreateCustomPackage = () => {
    setShowPopup(false);
    
    // Track custom package creation - IMPORTANT ACTION
    trackButtonClick("create_custom_package", {
      source: "welcome_popup"
    });
    
    navigate("/packages");
  };

  const handleFreeSkinAssessment = () => {
    setShowPopup(false);
    
    // Track skin assessment - IMPORTANT ACTION
    trackButtonClick("free_skin_assessment", {
      source: "welcome_popup"
    });
    
    navigate("/skin-clinic");
  };

  const handlePopupMainAction = () => {
    closePopup();
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="bg-gradient-to-r from-pink-100 via-white to-pink-50 py-24 px-8 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing offers...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Larger Popup with GIF - Increased height */}
       {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden transform animate-scale-in border-2 border-white/20 backdrop-blur-sm">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-300 shadow-lg border border-pink-200 hover:scale-110"
            >
              <span className="text-gray-700 text-xl font-light">×</span>
            </button>
            
            {/* Large GIF Section */}
            <div className="relative h-96 bg-gradient-to-r from-pink-400 to-purple-500 overflow-hidden">
              <img 
                src="https://res.cloudinary.com/dkdx7xytz/image/upload/v1772473704/Allanb_uvnmkk.gif"
                alt="Discover Beauty Products"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content Section */}
            <div className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3 text-center font-playfair">
                Begin Your Beauty Journey
              </h3>
              
              <p className="text-gray-700 mb-6 text-center text-base leading-relaxed font-inter">
                Discover personalized beauty products that match your unique style, skin type, and preferences.
              </p>
              
              {/* Main Action Button */}
              <button
                onClick={handlePopupMainAction}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg border-2 border-white/20 mb-4 text-lg font-inter"
              >
                Start Your Discovery
              </button>
              
              {/* Quick Options */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={handleCreateTimetable}
                  className="bg-white border-2 border-pink-200 text-pink-700 py-3 px-4 rounded-lg font-semibold hover:bg-pink-50 transition-all text-sm text-center font-inter"
                >
                  Create Skincare Timetable
                </button>
                <button
                  onClick={handleCreateCustomPackage}
                  className="bg-white border-2 border-purple-200 text-purple-700 py-3 px-4 rounded-lg font-semibold hover:bg-purple-50 transition-all text-sm text-center font-inter"
                >
                  Create Custom Package
                </button>
                <button
                  onClick={handleFreeSkinAssessment}
                  className="bg-white border-2 border-green-200 text-green-700 py-3 px-4 rounded-lg font-semibold hover:bg-green-50 transition-all text-sm text-center font-inter"
                >
                  Free Skin Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Banner Section - Updated to half height */}
      <section className="bg-gradient-to-r from-pink-100 via-white to-pink-50 py-16 px-8 min-h-[50vh] lg:min-h-[60vh] flex items-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left side: Text */}
          <div className="space-y-4 lg:space-y-6">
            <h3 className="uppercase tracking-widest text-sm font-semibold text-pink-600 font-inter">
              {bannerData.subtitle}
            </h3>
            
            {/* Improved Animated title with italic and catchy font */}
            <div className="relative">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight min-h-[80px] lg:min-h-[100px] flex items-center">
                <span className="bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text text-transparent italic font-dancing font-normal">
                  {displayedTitle}
                </span>
                <span className={`inline-block w-1 h-8 lg:h-10 bg-pink-500 ml-2 align-middle ${
                  isTyping ? 'animate-pulse' : 'opacity-0'
                } transition-opacity`}></span>
              </h1>
              
              {/* Subtle background text effect */}
              <div className="absolute inset-0 flex items-center opacity-5 pointer-events-none">
                <span className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 whitespace-nowrap italic font-dancing">
                  {bannerData.titleOptions?.[currentTitleIndex] || "BEAUTIFUL SKIN"}
                </span>
              </div>
            </div>
            
            {/* Static description text */}
            <div className="mt-4 lg:mt-6">
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed font-inter">
                {bannerData.description}
              </p>
            </div>

            <div className="flex gap-3 lg:gap-4 mt-6 lg:mt-8">
              <button 
                onClick={handleDiscoverProducts}
                className="px-6 lg:px-8 py-3 lg:py-4 bg-pink-600 text-white rounded-2xl shadow-lg hover:bg-pink-700 transition transform hover:scale-105 font-semibold text-sm lg:text-base font-inter"
              >
                Discover Products
              </button>
              <button 
                onClick={handleLearnMore}
                className="px-6 lg:px-8 py-3 lg:py-4 bg-white text-pink-600 border border-pink-300 rounded-2xl shadow-lg hover:bg-pink-50 transition transform hover:scale-105 font-semibold text-sm lg:text-base font-inter"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right side: Discovery Wheel */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              {/* Wheel container - Slightly smaller for better proportion */}
              <div className="relative w-64 lg:w-72 xl:w-80 h-64 lg:h-72 xl:h-80">
                {/* Wheel */}
                <div 
                  ref={wheelRef}
                  className="absolute inset-0 rounded-full overflow-hidden border-6 lg:border-8 border-white shadow-2xl transition-transform duration-100 cursor-pointer hover:shadow-2xl hover:border-pink-300 transition-all"
                  style={{ transform: 'rotate(0deg)' }}
                >
                  {/* Wheel segments */}
                  <div className="absolute inset-0">
                    {productCategories.map((category, index) => {
                      const rotation = (index / productCategories.length) * 360;
                      const segmentRotation = rotation + (360 / productCategories.length / 2);
                      return (
                        <div
                          key={index}
                          className="absolute top-0 left-1/2 w-1/2 h-1/2 transform origin-bottom-left transition-all duration-300"
                          style={{
                            transform: `rotate(${rotation}deg)`,
                            background: index % 2 === 0 ? '#fce7f3' : '#fbcfe8'
                          }}
                        >
                          <div
                            className="absolute top-10 lg:top-12 left-0 w-full text-center transform"
                            style={{ 
                              transform: `rotate(${segmentRotation}deg)`,
                              transformOrigin: 'bottom left'
                            }}
                          >
                            <span className="text-xs lg:text-sm font-bold text-pink-900 px-2 font-inter">
                              {category.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Center circle */}
                  <div className="absolute inset-10 lg:inset-12 bg-white rounded-full border-4 lg:border-6 border-pink-400 flex items-center justify-center shadow-lg">
                    <span className="text-pink-600 font-bold text-xs lg:text-sm text-center px-2 font-inter">DISCOVER BEAUTY</span>
                  </div>
                </div>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 lg:w-8 h-10 lg:h-12 bg-gradient-to-b from-pink-600 to-purple-600 clip-triangle shadow-lg"></div>
                </div>
              </div>
              
              {/* Spin button */}
              <button
                onClick={startSpin}
                disabled={isSpinning}
                className={`mt-8 lg:mt-10 px-8 lg:px-10 py-3 lg:py-4 rounded-2xl shadow-xl transition-all text-base lg:text-lg font-bold font-inter ${
                  isSpinning 
                    ? 'bg-gray-400 cursor-not-allowed transform scale-95' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transform hover:scale-110 active:scale-105'
                } text-white disabled:opacity-70`}
              >
                {isSpinning ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 lg:mr-3 h-4 lg:h-5 w-4 lg:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Discovering...
                  </span>
                ) : (
                  'Spin to Discover'
                )}
              </button>
              
              {/* Discovery reveal */}
              {showDiscovery && discovery && (
                <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-300 rounded-2xl text-center animate-bounce-in shadow-lg">
                  <h3 className="font-bold text-pink-700 text-base lg:text-lg mb-2 font-inter">Perfect Match!</h3>
                  <p className="text-pink-900 font-semibold font-inter">Discover: {discovery.name}</p>
                  <p className="text-gray-600 text-sm mt-1 font-inter">{discovery.description}</p>
                  <p className="text-gray-500 text-xs mt-2 font-inter">Taking you to explore...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Add CSS for triangle pointer and font imports */}
        <style jsx>{`
          .clip-triangle {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
        `}</style>
        
        {/* Add font imports in the head of your HTML or in your global CSS */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
          
          .font-dancing {
            font-family: 'Dancing Script', cursive;
          }
          
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
          
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </section>
    </>
  );
};

export default Banner;