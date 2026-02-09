import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { login } from "../redux/apiCall";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser, isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redirect after login
  useEffect(() => {
    if (currentUser) {
      toast.success("Login successful 🎉");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    }
  }, [currentUser, navigate]);

  // validation
  const validateForm = () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter valid email address");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (loading || isFetching) return;

    setLoading(true);
    try {
      await login(dispatch, { email: email.trim(), password });
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Login failed. Check email & password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-xl overflow-hidden max-w-[900px] w-full">
        {/* LEFT IMAGE */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-50">
          <img
            src="/lotion1.jpg"
            alt="Beauty"
            className="w-full object-contain p-6 transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 md:p-12 w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-700 mb-8">
            Welcome Back 👋
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500 text-sm"
                >
                  {showPass ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#d55fbb]" />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-[#d55fbb] font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading || isFetching}
              className="w-full py-3 bg-[#d55fbb] text-white font-semibold rounded-md transition hover:bg-[#bf3ca4] disabled:opacity-50"
            >
              {loading || isFetching ? "Logging in..." : "Login"}
            </button>

            {/* SIGN UP */}
            <div className="text-sm text-gray-600 text-center">
              Don&apos;t have an account?
              <Link
                to="/create-account"
                className="text-[#d55fbb] font-semibold hover:underline ml-1"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
