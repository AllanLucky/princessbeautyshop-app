import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { userRequest } from "../requestMethod";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  // ================= SUBMIT =================
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("All fields required");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const { data } = await userRequest.put(
        `/reset-password/${token}`,
        { password }
      );

      toast.success(data.message || "Password reset successful 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Reset failed. Token expired?"
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your new password below
        </p>

        {/* NEW PASSWORD */}
        <div className="mb-4">
          <label className="text-sm font-medium">New Password</label>
          <input
            type={show ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-rose-300 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-2">
          <label className="text-sm font-medium">Confirm Password</label>
          <input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-rose-300 outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* SHOW PASSWORD */}
        <div className="flex items-center mb-5 mt-2">
          <input
            type="checkbox"
            onChange={() => setShow(!show)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">Show password</span>
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
          {loading ? "Updating..." : "Reset Password"}
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

export default ResetPassword;