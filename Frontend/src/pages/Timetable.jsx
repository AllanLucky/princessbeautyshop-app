import React, { useState, useEffect } from "react";
import { userRequest } from "../requestMethod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Timetable = () => {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    skinType: "",
    concerns: [],
    morningTime: "7:00 AM",
    eveningTime: "9:00 PM",
  });

  // Reset errors when user data changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) setErrors({});
    if (apiError) setApiError(null);
  }, [userData]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!userData.name.trim()) newErrors.name = "Name is required";
    if (!userData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = "Invalid email address";
    if (!userData.skinType) newErrors.skinType = "Please select your skin type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      concerns: checked
        ? [...prev.concerns, value]
        : prev.concerns.filter((concern) => concern !== value),
    }));
  };

  // Mock submission fallback
  const handleMockSubmission = () =>
    new Promise((resolve) => setTimeout(() => resolve({ success: true }), 2000));

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 10000)
    );

    try {
      const response = await Promise.race([userRequest.post("/timetable", userData), timeoutPromise]);

      if (response.data?.success) {
        setSubmitted(true);
        toast.success(
          <div className="text-center">
            <div className="font-medium mb-2">Success!</div>
            <p className="text-sm">
              Your personalized skincare timetable will be sent to {userData.email} shortly!
            </p>
          </div>
        );
      } else {
        throw new Error(response.data?.message || "Failed to create timetable");
      }
    } catch (error) {
      console.error("API Error:", error);

      try {
        const mockResult = await handleMockSubmission();
        if (mockResult.success) {
          setSubmitted(true);
          toast.success(
            <div className="text-center">
              <div className="font-medium mb-2">Success (Mock)!</div>
              <p className="text-sm">
                While we set up our email system, here's a recommended routine for {userData.skinType} skin.
              </p>
            </div>
          );
        }
      } catch (mockError) {
        console.error("Mock submission failed:", mockError);
        setApiError("Submission failed. Please try again later.");
        toast.error(
          <div className="text-center">
            <div className="font-medium mb-2">Submission Failed</div>
            <p className="text-sm">Please try again in a moment.</p>
          </div>
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setSubmitted(false);
    setUserData({
      name: "",
      email: "",
      skinType: "",
      concerns: [],
      morningTime: "7:00 AM",
      eveningTime: "9:00 PM",
    });
    setApiError(null);
  };

  // Sample timetable data
  const sampleRoutines = [
    { day: "Monday", am: "Cleanser, Vitamin C Serum, Moisturizer, SPF 50", pm: "Double Cleanse, Retinol, Moisturizer" },
    { day: "Tuesday", am: "Cleanser, Hyaluronic Acid, Moisturizer, SPF 50", pm: "Double Cleanse, Hyaluronic Acid, Moisturizer" },
    { day: "Wednesday", am: "Cleanser, Niacinamide, Moisturizer, SPF 50", pm: "Double Cleanse, AHA Treatment, Moisturizer" },
    { day: "Thursday", am: "Cleanser, Antioxidant Serum, Moisturizer, SPF 50", pm: "Double Cleanse, Peptide Serum, Moisturizer" },
    { day: "Friday", am: "Cleanser, Vitamin C Serum, Moisturizer, SPF 50", pm: "Double Cleanse, Retinol, Moisturizer" },
    { day: "Saturday", am: "Cleanser, Exfoliating Toner, Moisturizer, SPF 50", pm: "Double Cleanse, Clay Mask, Recovery Serum" },
    { day: "Sunday", am: "Cleanser, Soothing Serum, Moisturizer, SPF 30", pm: "Double Cleanse, Hydrating Mask, Facial Oil" },
  ];

  const featuredProducts = [
    { name: "Luxury Ceramide Cleanser", category: "Cleanser", benefits: "Gentle cleansing, barrier protection" },
    { name: "Golden Vitamin C Serum", category: "Serum", benefits: "Brightening, antioxidant protection" },
    { name: "24K Gold Night Cream", category: "Moisturizer", benefits: "Overnight repair, hydration" },
    { name: "Diamond Exfoliator", category: "Exfoliator", benefits: "Smooth texture, refined pores" },
    { name: "Caviar Eye Complex", category: "Eye Care", benefits: "Reduce dark circles, firm skin" },
    { name: "Rose Quartz Face Oil", category: "Treatment", benefits: "Nourishment, glow enhancement" },
  ];

  const skinConcerns = [
    { value: "acne", label: "Acne", description: "Breakouts and blemishes" },
    { value: "aging", label: "Aging", description: "Fine lines and wrinkles" },
    { value: "darkSpots", label: "Dark Spots", description: "Hyperpigmentation" },
    { value: "redness", label: "Redness", description: "Sensitivity and irritation" },
    { value: "dryness", label: "Dryness", description: "Dehydration and flakiness" },
    { value: "oiliness", label: "Oiliness", description: "Excess sebum production" },
  ];

  const downloadPDF = () => toast.info("Sample PDF download feature coming soon!");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden p-4">
      <ToastContainer position="top-right" autoClose={5000} theme="light" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 mb-6">
            Your Personalized
            <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent">
              Skincare Journey
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/80">
            Discover your perfect routine with our expertly crafted 7-day luxury skincare timetable, tailored to your unique skin needs and lifestyle.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Sample Timetable & Products */}
          <div className="space-y-8">
            {/* Timetable Table */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/80 hover:border-white/90 transition-all duration-300">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Sample Skincare Timetable</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-violet-50">
                      <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">Day</th>
                      <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">AM Routine</th>
                      <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">PM Routine</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sampleRoutines.map((routine) => (
                      <tr key={routine.day} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-800">{routine.day}</td>
                        <td className="p-4 text-slate-600">{routine.am}</td>
                        <td className="p-4 text-slate-600">{routine.pm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Products */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl border border-blue-100 shadow-lg">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Featured Luxury Products</h4>
                <div className="grid gap-4">
                  {featuredProducts.map((product, i) => (
                    <div key={i} className="flex items-start justify-between p-3 bg-white/50 rounded-lg border border-white/80">
                      <div>
                        <div className="font-medium text-slate-800">{product.name}</div>
                        <div className="text-sm text-slate-600">{product.category} • {product.benefits}</div>
                      </div>
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mt-2"></div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={downloadPDF}
                className="w-full mt-6 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center transition-all duration-200"
              >
                Download Sample PDF
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-8">
            {!showForm && !submitted ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center shadow-2xl border border-white/80 hover:border-white/90 transition-all duration-300">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Get Your Custom Skincare Plan</h2>
                <p className="text-slate-600 mb-8 max-w-md text-lg leading-relaxed bg-white/50 rounded-2xl p-6 border border-white/80">
                  Receive a personalized 7-day luxury skincare routine designed specifically for your skin type, concerns, and schedule.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-2xl flex items-center justify-center transition-all duration-200"
                >
                  Create My Timetable
                </button>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/80">
                {submitted ? (
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-16 h-16 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Perfect! Check Your Email</h2>
                    <p className="text-slate-600">Your personalized timetable will be sent to:</p>
                    <p className="text-blue-600 font-semibold text-xl">{userData.email}</p>
                    <button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-3 px-8 rounded-xl shadow-2xl">
                      Create Another Timetable
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          className={`w-full p-4 rounded-xl border ${errors.name ? "border-red-400" : "border-slate-300"} shadow-sm`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          className={`w-full p-4 rounded-xl border ${errors.email ? "border-red-400" : "border-slate-300"} shadow-sm`}
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Skin Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Skin Type</label>
                      <select
                        name="skinType"
                        value={userData.skinType}
                        onChange={handleInputChange}
                        className={`w-full p-4 rounded-xl border ${errors.skinType ? "border-red-400" : "border-slate-300"} shadow-sm`}
                      >
                        <option value="">Select your skin type</option>
                        <option value="dry">Dry</option>
                        <option value="oily">Oily</option>
                        <option value="combination">Combination</option>
                        <option value="normal">Normal</option>
                        <option value="sensitive">Sensitive</option>
                      </select>
                      {errors.skinType && <p className="text-red-500 text-sm mt-2">{errors.skinType}</p>}
                    </div>

                    {/* Concerns */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Skin Concerns</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {skinConcerns.map((concern) => (
                          <label key={concern.value} className="flex flex-col p-4 bg-white border rounded-xl cursor-pointer">
                            <input
                              type="checkbox"
                              value={concern.value}
                              checked={userData.concerns.includes(concern.value)}
                              onChange={handleCheckboxChange}
                              className="sr-only"
                            />
                            <span className="text-sm font-medium">{concern.label}</span>
                            <span className="text-xs text-slate-600">{concern.description}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* AM & PM Times */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">AM Routine Time</label>
                        <select name="morningTime" value={userData.morningTime} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-300 shadow-sm">
                          <option value="6:00 AM">6:00 AM</option>
                          <option value="7:00 AM">7:00 AM</option>
                          <option value="8:00 AM">8:00 AM</option>
                          <option value="9:00 AM">9:00 AM</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">PM Routine Time</label>
                        <select name="eveningTime" value={userData.eveningTime} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-300 shadow-sm">
                          <option value="8:00 PM">8:00 PM</option>
                          <option value="9:00 PM">9:00 PM</option>
                          <option value="10:00 PM">10:00 PM</option>
                          <option value="11:00 PM">11:00 PM</option>
                        </select>
                      </div>
                    </div>

                    {apiError && <p className="text-red-600 text-center">{apiError}</p>}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-xl shadow-2xl flex items-center justify-center disabled:opacity-50"
                    >
                      {isLoading ? "Submitting..." : "Create Timetable"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
