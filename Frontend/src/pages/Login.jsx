import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/apiCall"; // <-- example action creator
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(user.currentUser)

  const handleLogin = async (e) => {
    e.preventDefault();
   
    try {
       setLoading(true);
       login(dispatch,{email, password});
       navigate("/")
       setLoading(false);
      
    } catch (error) {
          if (error.response && error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("An unexpected error occurred, please try again");
          }
        }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden max-w-[900px] w-full">
        {/* LOGIN IMAGE */}
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-gray-50">
          <img
            src="/lotion1.jpg"
            alt="login"
            className="w-full object-contain p-6 transition-all duration-700 hover:scale-105"
          />
        </div>

        {/* LOGIN FORM */}
        <div className="p-8 md:p-12 w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-700 mb-8 text-center md:text-left">
            Login
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email */}
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

            {/* Password */}
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

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#d55fbb]" />
                Remember me
              </label>

              <Link to="/forgot-password" className="text-[#d55fbb] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#d55fbb] text-white font-semibold rounded-md transition duration-300 hover:bg-[#bf3ca4] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register */}
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
