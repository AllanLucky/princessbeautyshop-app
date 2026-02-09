import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { userRequest } from "../requestMethod";
import "react-toastify/dist/ReactToastify.css";

const VerifyAccounty = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !code) {
      return toast.error("Email and code are required");
    }

    setLoading(true);
    try {
      const { data } = await userRequest.post("/auth/verify-email", {
        email,
        code,
      });

      toast.success(data.message || "Email verified successfully 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded shadow-md w-full max-w-[600px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Account</h2>
        <p className="text-gray-600 mb-4 text-center">
          Enter your email and the 6‑digit code we sent.
        </p>

        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border rounded mb-4 text-center tracking-widest text-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-md transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#d55fbb] hover:bg-[#c54fae]"
          }`}
        >
          {loading ? "Verifying..." : "Verify Account"}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Didn’t get the code? Check your spam folder or request a new one.
        </p>
      </form>
    </div>
  );
};

export default VerifyAccounty;
