import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { userRequest } from "../requestMethod"; // use your configured axios instance

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter email");

    try {
      setLoading(true);
      const { data } = await userRequest.post("/auth/forgotpassword", {
        email,
      });

      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <form
        onSubmit={submitHandler}
        className="bg-white px-2 py-3 md:p-6 rounded shadow-md w-full max-w-[600px] mx-4"
      >
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 border mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white p-3 rounded"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
