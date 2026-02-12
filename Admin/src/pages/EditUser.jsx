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

  // ================= GET USER =================
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userRequest.get(`/users/${id}`);
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
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
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // ================= UPDATE USER =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let avatarUrl = user.avatar;

      // upload image if selected
      if (selectedImage) {
        const data = new FormData();
        data.append("file", selectedImage);
        data.append("upload_preset", "uploads");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
          { method: "POST", body: data }
        );

        const uploadData = await uploadRes.json();
        avatarUrl = uploadData.url;
      }

      await userRequest.put(`/users/${id}`, {
        ...inputs,
        avatar: avatarUrl,
      });

      toast.success("User updated successfully");
      setInputs({});
      setSelectedImage(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen w-full">
      <ToastContainer />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-3xl font-semibold">Edit User</h3>
        <Link to="/users">
          <button className="bg-slate-500 text-white py-2 px-4 rounded-lg">
            Back
          </button>
        </Link>
      </div>

      {/* USER CARD */}
      <div className="bg-white p-5 rounded-lg shadow-lg mb-5">
        <div className="flex items-center gap-5">
          {/* <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : user.avatar || "/avatar.png"}
            className="h-20 w-20 rounded-full object-cover"
          /> */}
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* UPDATE FORM */}
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <form
          onSubmit={handleUpdate}
          className="flex flex-col md:flex-row gap-5"
        >
          {/* LEFT */}
          <div className="flex-1 space-y-4">
            <input
              name="name"
              placeholder={user.name}
              onChange={handleChange}
              value={inputs.name || ""}
              className="w-full border p-2 rounded"
            />

            <input
              name="email"
              placeholder={user.email}
              onChange={handleChange}
              value={inputs.email || ""}
              className="w-full border p-2 rounded"
            />

            <select
              name="role"
              onChange={handleChange}
              value={inputs.role || user.role}
              className="w-full border p-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <select
              name="isActive"
              onChange={handleChange}
              value={inputs.isActive ?? user.isActive}
              className="w-full border p-2 rounded"
            >
              <option value={true}>Active</option>
              <option value={false}>Disabled</option>
            </select>
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex flex-col items-center gap-5">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : user.avatar || "/avatar.png"}
              className="h-32 w-32 rounded-full object-cover"
            />

            <input type="file" hidden id="file" onChange={handleImageChange} />
            <label htmlFor="file" className="cursor-pointer">
              <FaUpload className="text-3xl text-gray-700" />
            </label>

            <button className="bg-slate-600 text-white py-3 px-6 rounded-lg">
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;