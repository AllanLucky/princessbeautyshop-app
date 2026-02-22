import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { FaUpload } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const EditUser = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const [user, setUser] = useState({});
  const [inputs, setInputs] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= GET USER =================
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userRequest.get(`/users/${id}`);
        setUser(res.data.user);
      } catch (err) {
        toast.error(err);
      }
    };

    getUser();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= IMAGE CHANGE =================
  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // ================= UPDATE USER =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let avatarUrl = user.avatar;

      // Upload new image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", "uploads");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();
        avatarUrl = uploadData.secure_url || uploadData.url;
      }

      await userRequest.put(`/users/${id}`, {
        ...inputs,
        avatar: avatarUrl,
      });

      toast.success("User updated successfully");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">

      <ToastContainer position="top-right" autoClose={2000} />

      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Edit User
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Update user profile information
            </p>
          </div>

          <Link to="/users">
            <button className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-xl transition shadow">
              Back
            </button>
          </Link>

        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-8">

            {/* LEFT FORM */}
            <div className="space-y-5">

              <input
                name="name"
                placeholder={user.name}
                value={inputs.name || ""}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />

              <input
                name="email"
                placeholder={user.email}
                value={inputs.email || ""}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />

              <select
                name="role"
                onChange={handleChange}
                value={inputs.role || user.role || "user"}
                className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <select
                name="isActive"
                onChange={handleChange}
                value={
                  inputs.isActive !== undefined
                    ? inputs.isActive
                    : user.isActive ?? true
                }
                className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              >
                <option value={true}>Active</option>
                <option value={false}>Disabled</option>
              </select>

            </div>

            {/* RIGHT PROFILE IMAGE */}
            <div className="flex flex-col items-center justify-center gap-6">

              <div className="relative group">

                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : user.avatar || "/avatar.png"
                  }
                  className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white"
                />

                <label
                  htmlFor="file"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-full text-white"
                >
                  <FaUpload className="text-2xl" />
                </label>

              </div>

              <input
                type="file"
                id="file"
                hidden
                onChange={handleImageChange}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl shadow-lg transition disabled:opacity-60 font-semibold"
              >
                {loading ? "Updating..." : "Update User"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;