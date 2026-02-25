import { useState } from "react";
import { userRequest } from "../requestMethod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const RaiseTicket = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(""); // optional if linked to a product
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    try {
      setLoading(true);
      const res = await userRequest.post("/tickets", { subject, message, productId });
      console.log(res)
      toast.success("Ticket raised successfully!");
      setSubject("");
      setMessage("");
      setProductId("");
      // Redirect to user ticket list
      navigate("/support-tickets");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to raise ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <ToastContainer position="top-right" autoClose={2500} />
      
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 mt-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Raise a Support Ticket</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-indigo-300 outline-none"
          />

          {/* Optional Product ID */}
          <input
            type="text"
            placeholder="Product ID (optional)"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-indigo-300 outline-none"
          />

          {/* Message */}
          <textarea
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-indigo-300 outline-none"
            rows={5}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl w-full font-semibold disabled:opacity-60 transition"
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;