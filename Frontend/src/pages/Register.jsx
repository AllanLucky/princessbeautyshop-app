import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      await userRequest.post("/auth/register", { name, email, password });

      toast.success("Account created successfully 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong, try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-6 md:py-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-[900px]">
        
        {/* LEFT IMAGE (hide on mobile) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-50">
          <img
            src="/lotion1.jpg"
            alt="register"
            className="w-full object-contain p-6 transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* FORM */}
        <div className="w-full md:w-1/2 px-5 py-6 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 md:mb-8 text-center md:text-left">
            Create Account
          </h2>

          <form className="space-y-5 md:space-y-6" onSubmit={handleRegister}>
            {/* NAME */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm">Password</label>
              <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="******"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#d55fbb] hover:bg-[#c54fae]"
              }`}
            >
              {loading ? "Creating account..." : "Register"}
            </button>

            {/* LOGIN */}
            <div className="text-sm text-gray-600 text-center">
              Already have an account?
              <Link
                to="/login"
                className="text-[#d55fbb] font-semibold hover:underline ml-1"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;