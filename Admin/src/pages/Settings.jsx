import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userRequest } from "../requestMethods"; // Axios instance

const Settings = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!email && !newPassword) {
      toast.error("Please enter new email or password to update!");
      return;
    }

    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      toast.error("To change password, both current and new password are required");
      return;
    }

    setLoading(true);
    try {
      // Update email
      if (email) {
        await userRequest.put("/users/update-profile", { email });
      }

      // Update password
      if (currentPassword && newPassword) {
        await userRequest.put("/users/change-password", { currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
      }

      toast.success("Settings updated successfully!");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update settings. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="New Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
            />
          </div>

          {/* Current Password */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Current Password</label>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
            />
          </div>

          {/* New Password */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full md:w-auto py-3 px-8 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
