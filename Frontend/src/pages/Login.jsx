import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { login } from "../redux/apiCall";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, isFetching, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect after successful login
  useEffect(() => {
    if (currentUser) {
      toast.success("Login successful!");
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      await login(dispatch, { email, password });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden max-w-[900px] w-full">
        {/* Left Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-50">
          <img
            src="/lotion1.jpg"
            alt="Login illustration"
            className="w-full object-contain p-6 transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Form */}
        <div className="p-8 md:p-12 w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-700 mb-8">Login</h2>

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
              disabled={loading || isFetching}
              className="w-full py-3 bg-[#d55fbb] text-white font-semibold rounded-md transition hover:bg-[#bf3ca4] disabled:opacity-50"
            >
              {loading || isFetching ? "Logging in..." : "Login"}
            </button>

            {error && (
              <p className="text-sm text-red-500 text-center">
                Invalid email or password
              </p>
            )}

            <div className="text-sm text-gray-600 text-center">
              Don&apos;t have an account?
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
