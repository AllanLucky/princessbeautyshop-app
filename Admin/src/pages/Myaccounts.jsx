import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { userRequest } from "../requestMethods"; // Axios instance
import { logout } from "../redux/adminRedux";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaSignOutAlt, FaSave } from "react-icons/fa";

const Myaccounts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin.currentAdmin);

  const [email, setEmail] = useState(admin?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState(admin?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">You are not logged in.</p>
      </div>
    );
  }

  // Upload avatar to Cloudinary if changed
  const uploadAvatar = async () => {
    if (profilePic instanceof File) {
      const data = new FormData();
      data.append("file", profilePic);
      data.append("upload_preset", "uploads"); // your Cloudinary preset

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
        data
      );

      return res.data.secure_url; // Cloudinary URL
    }
    return profilePic; // No change
  };

  // Save all changes
  const handleSaveChanges = async () => {
    if (!email) {
      toast.error("Email cannot be empty!");
      return;
    }

    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      toast.error("To change password, both current and new password are required");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Upload avatar if changed
      const avatarUrl = await uploadAvatar();
      setProfilePic(avatarUrl);

      // 2️⃣ Update profile (email + avatar)
      await userRequest.put("/users/update-profile", {
        email,
        avatar: avatarUrl,
      });

      // 3️⃣ Change password if provided
      if (currentPassword && newPassword) {
        await userRequest.put("/users/change-password", {
          currentPassword,
          newPassword,
        });
        setCurrentPassword("");
        setNewPassword("");
      }

      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]); // store File for upload
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    dispatch(logout());
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/login"), 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="text-center p-10 border-b border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Admin Profile</h1>
          <p className="text-gray-500 text-lg">Manage your personal information and security</p>
        </div>

        {/* PROFILE SECTION */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start p-8 gap-10">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={profilePic instanceof File ? URL.createObjectURL(profilePic) : profilePic || "/avatar.png"}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
            />
            <label
              htmlFor="profilePic"
              className="flex items-center gap-2 mt-4 cursor-pointer text-pink-500 hover:text-pink-600 font-medium transition"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={admin.name}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editMode}
                  className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none ${
                    !editMode && "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={!editMode}
                  placeholder={editMode ? "Enter current password" : "Disabled"}
                  className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none ${
                    !editMode && "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!editMode}
                  placeholder={editMode ? "Enter new password" : "Disabled"}
                  className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none ${
                    !editMode && "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setEditMode(!editMode)}
                className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-xl font-medium transition shadow-lg hover:shadow-xl"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>

              {editMode && (
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="w-full md:w-auto bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white py-3 px-8 rounded-xl font-medium transition shadow-lg hover:scale-[1.03] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaSave /> {loading ? "Saving..." : "Save Changes"}
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccounts;
