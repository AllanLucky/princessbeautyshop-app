import { useState } from "react";
import { userRequest } from "../requestMethods";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= IMAGE CHANGE =================
  const imageChange = (e) => {
    if (e.target.files?.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
    });

    setSelectedImage(null);
    setUploading("");
  };

  // ================= SUBMIT BLOG =================
  const submitBlog = async (e) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }

    if (!selectedImage) {
      toast.error("Please select blog image");
      return;
    }

    try {
      setLoading(true);
      setUploading("Uploading image...");

      // Upload image to Cloudinary
      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "uploads");

      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
        data
      );

      const imageUrl = uploadRes.data.secure_url;

      await userRequest.post(
        "/blogs",
        {
          ...form,
          image: imageUrl,
          tags: form.tags
            ? form.tags.split(",").map((t) => t.trim())
            : [],
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Blog created successfully 🔥");

      resetForm();

      setTimeout(() => {
        navigate("/blogs");
      }, 1000);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Create blog failed"
      );
    } finally {
      setLoading(false);
      setUploading("");
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start px-3 sm:px-6 py-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Add New Blog</h1>

          <Link to="/blogs">
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
              Back
            </button>
          </Link>
        </div>

        <form className="space-y-4" onSubmit={submitBlog}>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="font-semibold block mb-2">
              Blog Image
            </label>

            <div className="relative w-32 h-32 border rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">

              {!selectedImage ? (
                <label htmlFor="file" className="flex flex-col items-center text-gray-500 cursor-pointer">
                  <FaPlus className="text-2xl mb-1" />
                  Select Image
                </label>
              ) : (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              )}

              <input
                type="file"
                id="file"
                hidden
                onChange={imageChange}
              />
            </div>

            {uploading && (
              <p className="text-green-600 text-sm mt-1">
                {uploading}
              </p>
            )}
          </div>

          <input
            name="title"
            placeholder="Blog title"
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
            value={form.title}
          />

          <textarea
            name="content"
            placeholder="Blog content"
            className="w-full border p-3 rounded-lg h-40"
            onChange={handleChange}
            value={form.content}
          />

          <input
            name="excerpt"
            placeholder="Excerpt"
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
            value={form.excerpt}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="category"
              placeholder="Category"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              value={form.category}
            />

            <input
              name="tags"
              placeholder="Tags (comma separated)"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              value={form.tags}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateBlog;