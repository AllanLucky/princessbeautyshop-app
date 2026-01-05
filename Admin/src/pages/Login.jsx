import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../redux/adminApiCalls";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    const { success, error: loginError } = await loginAdmin(dispatch, { email, password });

    if (success) {
      setIsTransitioning(true);
      setTimeout(() => navigate("/admin-dashboard"), 700);
    } else {
      setError(loginError);
    }

    setLoading(false);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 transition-all duration-700 ease-in-out ${isTransitioning ? 'opacity-0 transform scale-105' : 'opacity-100'}`}>
      
      <div className="max-w-md w-full bg-gradient-to-tl from-white/20 via-white/10 to-white/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8">
        
        {/* Header */}
        <div className="flex items-center mb-6 justify-center">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg mr-4">
            <FaUserShield className="text-white text-2xl" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-white/70 text-sm mt-1">Administrator Access Only</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/40 rounded-xl text-red-100 text-sm backdrop-blur-sm flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-white text-sm font-semibold uppercase tracking-wider">Admin Email</label>
            <div className="relative group">
              <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-white/70 group-focus-within:text-pink-400 transition-colors duration-300" />
              <input
                type="email"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-white text-sm font-semibold uppercase tracking-wider">Password</label>
            <div className="relative group">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-white/70 group-focus-within:text-pink-400 transition-colors duration-300" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white/70 hover:text-pink-400 transition-colors duration-300"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || isTransitioning}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-pink-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying Admin Access..." : <span className="flex items-center"><FaUserShield className="mr-2" />Access Admin Dashboard</span>}
          </button>
        </form>

        {/* <p className="mt-6 text-sm text-white/70 text-center">
          &copy; 2026 Admin Management System • Administrator Access Required
        </p> */}
      </div>
    </div>
  );
};

export default Login;
