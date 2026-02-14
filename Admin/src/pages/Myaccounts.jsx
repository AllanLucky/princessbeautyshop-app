import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateAdminCredentials } from "../redux/adminApiCalls"; 
import { logout } from "../redux/adminRedux";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaEnvelope,
  FaLock,
  FaSignOutAlt,
  FaSave,
  FaUser,
} from "react-icons/fa";

const Myaccounts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin.currentAdmin);

  const [email, setEmail] = useState(admin?.email || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(admin?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleUpdate = async () => {
    if (!email || !password) {
      toast.error("Email and password cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const { success, error } = await updateAdminCredentials(dispatch, admin.id, {
        email,
        password,
        avatar: profilePic,
      });

      if (success) {
        toast.success("Profile updated successfully!");
        setPassword("");
        setEditMode(false);
      } else {
        toast.error(error);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    dispatch(logout());
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/login"), 700);
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="text-center p-8 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Profile</h1>
          <p className="text-gray-600">Manage your personal information and security</p>
        </div>

        {/* STATS - moved to top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 border-b border-gray-100 bg-gray-50">
          <div className="bg-white p-4 rounded-lg text-center shadow">
            <p className="text-sm text-gray-500">Role</p>
            <h4 className="font-bold text-gray-800 capitalize">{admin.role || "admin"}</h4>
          </div>
          <div className="bg-white p-4 rounded-lg text-center shadow">
            <p className="text-sm text-gray-500">Status</p>
            <h4 className="font-bold text-green-600">Active</h4>
          </div>
          <div className="bg-white p-4 rounded-lg text-center shadow">
            <p className="text-sm text-gray-500">Account</p>
            <h4 className="font-bold text-gray-800">Verified</h4>
          </div>
        </div>

        {/* PROFILE TOP */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start p-8 gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={profilePic || "/avatar.png"}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover border-2 border-gray-300"
            />
            <label
              htmlFor="profilePic"
              className="flex items-center gap-2 mt-3 cursor-pointer text-pink-500 hover:text-pink-600 transition"
            >
              <FaUpload /> Change Photo
            </label>
            <input
              type="file"
              id="profilePic"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 w-full">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={admin.name}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editMode}
                  className={`w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-pink-300 outline-none ${
                    !editMode && "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!editMode}
                  placeholder={editMode ? "Enter new password" : "Disabled"}
                  className={`w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-pink-300 outline-none ${
                    !editMode && "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setEditMode(!editMode)}
                className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg font-medium transition"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>

              {editMode && (
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full md:w-auto bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white py-2 px-6 rounded-lg font-medium transition hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center"
                >
                  <FaSave className="mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium flex items-center justify-center"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccounts;
