import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/apiCall"; 
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.currentUser) {
      toast.success("User logged in successfully!");

      // Redirect based on role
      if (user.currentUser.role === "admin") {
        // Admin goes to admin frontend (port 5173)
        window.location.href = "http://localhost:5173/admin-dashboard";
      } else {
        // Regular user goes to main frontend (port 5174)
        navigate("/");
      }
    }
  }, [user.currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(dispatch, { email, password });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden max-w-[900px] w-full">
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-gray-50">
          <img
            src="/lotion1.jpg"
            alt="login"
            className="w-full object-contain p-6 transition-all duration-700 hover:scale-105"
          />
        </div>

        <div className="p-8 md:p-12 w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-700 mb-8 text-center md:text-left">
            Login
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#d55fbb]" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-[#d55fbb] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#d55fbb] text-white font-semibold rounded-md transition duration-300 hover:bg-[#bf3ca4] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-sm text-gray-600 text-center">
              Don't have an account?
              <Link to="/create-account" className="text-[#d55fbb] hover:underline ml-1">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
