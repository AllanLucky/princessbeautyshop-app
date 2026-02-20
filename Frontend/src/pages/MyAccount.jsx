import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { userRequest } from "../requestMethod";
import { logout, updateUser } from "../redux/userRedux";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaSignOutAlt, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";

const MyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log("Current User from Redux:", currentUser);

  const [user, setUser] = useState(null); // user fetched from backend
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // Originals for cancel
  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalAvatar, setOriginalAvatar] = useState("");

  // ================= FETCH LOGIN USER =================
  const fetchUser = async () => {
    try {
      const res = await userRequest.get("/users/me");
      setUser(res.data.user);
      setName(res.data.user.name || "");
      setEmail(res.data.user.email || "");
      setProfilePic(res.data.user.avatar || "/avatar.png");

      setOriginalName(res.data.user.name || "");
      setOriginalEmail(res.data.user.email || "");
      setOriginalAvatar(res.data.user.avatar || "/avatar.png");

      dispatch(updateUser(res.data.user));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch user data");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">You are not logged in.</p>
      </div>
    );
  }

  // ================= UPLOAD AVATAR =================
  const uploadAvatar = async () => {
    if (profilePic instanceof File) {
      const data = new FormData();
      data.append("file", profilePic);
      data.append("upload_preset", "uploads");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
          data
        );
        return res.data.secure_url;
      } catch (err) {
        toast.error("Image upload failed");
        throw err;
      }
    }
    return profilePic;
  };

  // ================= SAVE CHANGES =================
  const handleSaveChanges = async () => {
    if (!name || !email) return toast.error("Name & email required");
    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      return toast.error("Both current & new password required");
    }
    if (newPassword && newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar();

      // update profile
      const res = await userRequest.put("/users/update-profile", {
        name,
        email,
        avatar: avatarUrl,
      });
      setUser(res.data.user);
      dispatch(updateUser(res.data.user));

      // update password if provided
      if (currentPassword && newPassword) {
        await userRequest.put("/users/change-password", {
          currentPassword,
          newPassword,
        });
        toast.success("Password changed successfully!");
      }

      toast.success("Profile updated successfully");
      setEditMode(false);
      setCurrentPassword("");
      setNewPassword("");

      setOriginalName(name);
      setOriginalEmail(email);
      setOriginalAvatar(avatarUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= CANCEL =================
  const handleCancel = () => {
    setName(originalName);
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
    if (!window.confirm("Logout now?")) return;
    dispatch(logout());
    toast.success("Logged out");
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-5xl font-extrabold text-pink-600 mb-8 text-center">
        My Account
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        {/* IMAGE */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <img
            src={
              profilePic instanceof File
                ? URL.createObjectURL(profilePic)
                : profilePic || "/avatar.png"
            }
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border"
          />

          <label className="cursor-pointer text-pink-600 font-semibold flex gap-2 items-center">
            <FaUpload /> Change Photo
            <input type="file" hidden onChange={handleImageChange} />
          </label>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editMode}
              className={`w-full border px-4 py-2 rounded-lg ${!editMode ? "bg-gray-100" : ""}`}
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editMode}
              className={`w-full border px-4 py-2 rounded-lg ${!editMode ? "bg-gray-100" : ""}`}
            />
          </div>

          <div>
            <label className="font-semibold">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={!editMode}
                className="w-full border px-4 py-2 rounded-lg"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div>
            <label className="font-semibold">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={!editMode}
                className="w-full border px-4 py-2 rounded-lg"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={editMode ? handleCancel : () => setEditMode(true)}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl"
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>

            {editMode && (
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl flex gap-2 items-center"
              >
                <FaSave /> {loading ? "Saving..." : "Save Changes"}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-gray-200 px-6 py-3 rounded-xl flex gap-2 items-center"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;