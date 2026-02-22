import { useState } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NotificationCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    message: "",
    userId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await userRequest.post("/notifications", form);

      toast.success("Notification created successfully");

      // ✅ Navigate to notification list page
      setTimeout(() => {
        navigate("/notifications");
      }, 1000);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create notification"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-5xl mx-auto space-y-6">

        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Create Notification
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Send system notifications to users
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
        >

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter notification title"
              className="w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition px-4 py-3 rounded-xl outline-none"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write notification message..."
              className="w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition px-4 py-3 rounded-xl h-40 outline-none resize-none"
            />
          </div>

          {/* User ID */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              User ID <span className="text-gray-400">(optional)</span>
            </label>
            <input
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="Enter user ID if targeting specific user"
              className="w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition px-4 py-3 rounded-xl outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white py-3.5 rounded-xl font-semibold shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading && (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            {loading ? "Creating Notification..." : "Create Notification"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default NotificationCreate;