import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { userRequest } from "../requestMethods";
import { logout, updateAdmin } from "../redux/adminRedux"; // <-- updateAdmin action
import { useNavigate } from "react-router-dom";
import { FaUpload, FaSignOutAlt, FaSave } from "react-icons/fa";

const Myaccounts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin.currentAdmin);

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Keep original values to restore if Cancel is clicked
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalAvatar, setOriginalAvatar] = useState("");

  useEffect(() => {
    if (admin) {
      setEmail(admin.email || "");
      setProfilePic(admin.avatar || "/avatar.png");
      setOriginalEmail(admin.email || "");
      setOriginalAvatar(admin.avatar || "/avatar.png");
    }
  }, [admin]);

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">You are not logged in.</p>
      </div>
    );
  }

  // Upload avatar to Cloudinary
  const uploadAvatar = async () => {
    if (profilePic instanceof File) {
      const data = new FormData();
      data.append("file", profilePic);
      data.append("upload_preset", "uploads"); // must exist in your Cloudinary dashboard

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
          data
        );
        return res.data.secure_url;
      } catch (err) {
        toast.error("Image upload failed");
        console.error(err);
        throw err;
      }
    }
    return profilePic; // already a URL
  };

  const handleSaveChanges = async () => {
    if (!email) return toast.error("Email cannot be empty");

    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      return toast.error(
        "Both current and new password required to change password"
      );
    }

    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar();

      // Update profile
      const res = await userRequest.put("/users/update-profile", {
        email,
        avatar: avatarUrl,
      });

      // Update Redux and localStorage
      dispatch(updateAdmin(res.data.user));

      // Change password if provided
      if (currentPassword && newPassword) {
        await userRequest.put("/users/change-password", {
          currentPassword,
          newPassword,
        });
      }

      toast.success("Profile updated successfully!");
      setEditMode(false);
      setCurrentPassword("");
      setNewPassword("");

      // Update original values
      setOriginalEmail(email);
      setOriginalAvatar(avatarUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail(originalEmail);
    setProfilePic(originalAvatar);
    setCurrentPassword("");
    setNewPassword("");
    setEditMode(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
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
      
      {/* Updated Heading */}
      <h1 className="text-5xl font-extrabold text-pink-600 mb-8 text-center drop-shadow-lg">
        Admin Account Profile
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={
              profilePic instanceof File
                ? URL.createObjectURL(profilePic)
                : profilePic || "/avatar.png"
            }
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
          />
          <label
            htmlFor="profilePic"
            className="cursor-pointer text-pink-500 hover:text-pink-600 flex items-center gap-2 font-medium"
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

        {/* Profile Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editMode}
              className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-300 outline-none ${
                !editMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={!editMode}
              placeholder={editMode ? "Enter current password" : "Disabled"}
              className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-300 outline-none ${
                !editMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!editMode}
              placeholder={editMode ? "Enter new password" : "Disabled"}
              className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-300 outline-none ${
                !editMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <button
              onClick={editMode ? handleCancel : () => setEditMode(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-xl font-medium transition shadow-lg"
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>

            {editMode && (
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white py-3 px-6 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <FaSave /> {loading ? "Saving..." : "Save Changes"}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-xl flex items-center gap-2 shadow"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccounts;
