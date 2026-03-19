import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../redux/userRedux";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaSignOutAlt,
  FaSave,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userRequest } from "../requestMethod";

const MyAccount = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // User info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+254");
  const [address, setAddress] = useState("");

  // Password info
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Load user info on mount
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "+254");
      setAddress(currentUser.address || "");
    }
  }, [currentUser]);

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out successfully");
  };

  // ================= UPDATE USER PROFILE =================
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!validatePhone()) return;

    setLoadingProfile(true);
    try {
      const res = await userRequest.put("/users/update-profile", {
        name,
        email,
        phone,
        address,
      });
      dispatch(updateUser(res.data));
      toast.success("Account information updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
    setLoadingProfile(false);
  };

  // ================= UPDATE PASSWORD =================
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setLoadingPassword(true);
    try {
      await userRequest.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
    setLoadingPassword(false);
  };

  // ================= PHONE VALIDATION =================
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    if (!/^\+?\d*$/.test(value)) return; // Only digits + optional "+"

    if (!value.startsWith("+254")) value = "+254";

    if (value.length >= 5) {
      const code = value[4]; // After +254
      if (code !== "7" && code !== "1") {
        toast.error("Kenya numbers must start with 7 (mobile) or 1 (landline) after +254");
        return;
      }
    }

    if (value.length > 13) return;
    setPhone(value);
  };

  const validatePhone = () => {
    const mobileRegex = /^\+2547\d{8}$/; // Mobile: +2547XXXXXXXX
    const landlineRegex = /^\+2541\d{8}$/; // Landline: +2541XXXXXXXX
    if (!mobileRegex.test(phone) && !landlineRegex.test(phone)) {
      toast.error("Invalid Kenya phone number. Use +2547XXXXXXXX or +2541XXXXXXXX");
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-pink-800 mb-2">My Account</h1>
          <p className="text-gray-600 text-2xl">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Account Info */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <FaUser className="text-gray-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
                <p className="text-gray-600">{email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Personal Info Form */}
            <form className="space-y-5" onSubmit={handleSaveInfo}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-gray-600" /> Personal Information
              </h3>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-lg border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-lg border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 p-3 border rounded-lg border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-lg border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none transition duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className={`w-full flex justify-center items-center gap-2 py-3 bg-gray-800 text-white rounded-lg font-semibold transition duration-200 hover:bg-gray-900 ${
                  loadingProfile ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loadingProfile && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                )}
                <FaSave /> Save Changes
              </button>
            </form>

            {/* Password Form */}
            <form className="space-y-5" onSubmit={handleUpdatePassword}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaLock className="mr-2 text-gray-600" /> Password & Security
              </h3>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none transition duration-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none transition duration-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none transition duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className={`w-full flex justify-center items-center gap-2 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold transition duration-200 hover:bg-gray-200 ${
                  loadingPassword ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loadingPassword && (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-800"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                Update Password
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex justify-center items-center gap-2 py-3 bg-gray-50 text-gray-800 rounded-lg font-semibold transition duration-200 hover:bg-gray-100"
              >
                <FaSignOutAlt /> Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;