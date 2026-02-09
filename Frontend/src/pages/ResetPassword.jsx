import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { userRequest } from "../requestMethod"; // use your configured axios instance

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const { data } = await userRequest.put(
        `/auth/resetpassword/${token}`, // baseURL already includes /api/v1
        { password }
      );

      toast.success(data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded shadow-md w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white p-3 rounded"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
