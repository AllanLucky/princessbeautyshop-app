import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateAdminCredentials } from "../redux/adminApiCalls"; 
import { FaUpload } from "react-icons/fa";

const Myaccounts = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.currentAdmin);

  const [email, setEmail] = useState(admin?.email || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(admin?.avatar || "");
  const [loading, setLoading] = useState(false);

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
        setPassword(""); // clear password after update
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

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={admin.name}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <input
              type="text"
              value="ADMIN"
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="mt-6 w-full py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg disabled:opacity-50"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Myaccounts;
