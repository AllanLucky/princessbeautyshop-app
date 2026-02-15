import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { userRequest } from "../requestMethods";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const CreateCategory = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [inputs, setInputs] = useState({ name: "", description: "" });
  const [uploading, setUploading] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= IMAGE =================
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= RESET =================
  const resetForm = () => {
    setSelectedImage(null);
    setInputs({ name: "", description: "" });
    setUploading("");
  };

  // ================= CREATE CATEGORY =================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!inputs.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      if (selectedImage) {
        setUploading("Uploading image...");

        const data = new FormData();
        data.append("file", selectedImage);
        data.append("upload_preset", "uploads"); // your Cloudinary preset

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
          data
        );

        imageUrl = uploadRes.data.secure_url;
        setUploading("Uploaded ✅");
      }

      // send to backend
      await userRequest.post("/categories", {
        name: inputs.name,
        description: inputs.description,
        image: imageUrl,
      });

      toast.success("Category created successfully 🎉");
      setUploading("Uploaded 100%");
      resetForm();
      setTimeout(() => navigate("/categories"), 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed");
      setUploading("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 w-[77vw] overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Add New Category</h1>
        <Link to="/categories">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
            Back
          </button>
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <form className="flex flex-col md:flex-row gap-6" onSubmit={handleUpload}>
          {/* LEFT */}
          <div className="flex-1 space-y-5">
            {/* IMAGE */}
            <div>
              <label className="font-semibold mb-2">Category Image</label>
              <div className="relative">
                {!selectedImage ? (
                  <div className="border-2 h-32 w-32 border-gray-400 rounded-md flex items-center justify-center cursor-pointer">
                    <label htmlFor="file" className="flex flex-col items-center text-gray-600">
                      <FaPlus className="text-2xl mb-1" />
                      Select Image
                    </label>
                  </div>
                ) : (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="h-32 w-32 object-cover rounded-md border"
                  />
                )}
                <input type="file" id="file" onChange={imageChange} hidden />
              </div>
              {uploading && <span className="text-green-600">{uploading}</span>}
            </div>

            {/* NAME */}
            <div>
              <label className="block font-semibold mb-2">Category Name</label>
              <input
                name="name"
                value={inputs.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Category name"
              />
            </div>

            {/* DESC */}
            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={inputs.description}
                onChange={handleChange}
                rows={5}
                className="w-full border rounded px-3 py-2"
                placeholder="Category description"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-indigo-600 text-white rounded-xl font-semibold"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
