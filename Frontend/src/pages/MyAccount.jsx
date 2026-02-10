import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../redux/userRedux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { userRequest } from "../requestMethod";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSignOutAlt,
  FaSave,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Myaccount = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user.currentUser?.name || "",
    email: user.currentUser?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= UPDATE PROFILE =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 UPDATE PROFILE API
      await userRequest.put("/users/update-profile", {
        name: formData.name,
        email: formData.email,
      });

      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword) {
      return toast.error("Fill all password fields");
    }

    try {
      setLoading(true);

      await userRequest.put("/users/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success("Password changed successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (!confirm) return;

    dispatch(logout());
    toast.success("Logged out successfully!");

    setTimeout(() => {
      navigate("/login");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
            My Account
          </h1>
          <p className="text-gray-600">
            Manage your personal information and security
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* TOP PROFILE */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                {/* Avatar */}
                <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center mr-4 text-xl font-bold">
                  {user.currentUser?.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.currentUser?.name}
                  </h2>
                  <p className="text-gray-600">{user.currentUser?.email}</p>
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-5 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-rose-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Role</p>
                <h4 className="font-bold text-gray-800 capitalize">
                  {user.currentUser?.role || "customer"}
                </h4>
              </div>

              <div className="bg-rose-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Status</p>
                <h4 className="font-bold text-green-600">Active</h4>
              </div>

              <div className="bg-rose-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Account</p>
                <h4 className="font-bold text-gray-800">Verified</h4>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
            {/* PERSONAL INFO */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaUser className="text-rose-600 mr-2" />
                Personal Information
              </h3>

              <form onSubmit={handleUpdate} className="space-y-5">
                {/* NAME */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      disabled={!editMode}
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 outline-none ${
                        !editMode && "bg-gray-100 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      disabled={!editMode}
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 outline-none ${
                        !editMode && "bg-gray-100 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {editMode && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <FaSave className="mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </form>
            </div>

            {/* PASSWORD */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaLock className="text-rose-600 mr-2" />
                Password & Security
              </h3>

              <div className="space-y-5">
                {/* CURRENT PASSWORD */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 outline-none"
                    />
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 outline-none"
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-4 cursor-pointer text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg font-medium"
                >
                  Change Password
                </button>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center mt-4"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Last login: Today • Account secured
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccount;