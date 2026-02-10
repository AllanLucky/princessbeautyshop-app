import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { userRequest } from "../requestMethod";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ================= SUBMIT =================
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    const emailTrim = email.trim();

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(emailTrim)) {
      return toast.error("Enter valid email address");
    }

    try {
      setLoading(true);

      const { data } = await userRequest.post("/auth/forgotpassword", {
        email: emailTrim,
      });

      toast.success(
        data?.message || "Reset link sent to your email 📩"
      );

      setEmail("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-rose-50 to-white px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your email to receive reset link
        </p>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="text-sm font-medium">Email Address</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-rose-300 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-rose-600 hover:bg-rose-700"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* BACK LOGIN */}
        <p
          onClick={() => navigate("/login")}
          className="text-center text-sm text-rose-600 mt-5 cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;