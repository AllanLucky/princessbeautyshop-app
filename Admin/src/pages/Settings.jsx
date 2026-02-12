import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    setLoading(true);
    try {
      // TODO: Call your API to update settings
      // Example: await userRequest.put("/settings", { email, newPassword });

      toast.success("Settings updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Email Update */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="New Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Password Update */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Current Password</label>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="mt-4 w-full py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg disabled:opacity-50"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
