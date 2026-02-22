import { useState } from "react";
import { userRequest } from "../requestMethods";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
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
        { withCredentials: true }
      );

      toast.success("Blog published successfully 🚀");

      resetForm();

      setTimeout(() => {
        navigate("/blogs");
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Create blog failed"
      );
    } finally {
      setLoading(false);
      setUploading("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Create New Blog
            </h1>
            <p className="text-gray-500 mt-1">
              Share your thoughts with a beautifully crafted post.
            </p>
          </div>

          <Link to="/blogs">
            <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition shadow-md">
              Back to Blogs
            </button>
          </Link>
        </div>

        <form onSubmit={submitBlog} className="space-y-6">

          {/* ================= IMAGE UPLOAD ================= */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Blog Image
            </label>

            <div className="relative w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden hover:border-indigo-500 transition">

              {!selectedImage ? (
                <label
                  htmlFor="file"
                  className="flex flex-col items-center text-gray-400 cursor-pointer"
                >
                  <FaPlus className="text-3xl mb-2" />
                  Click to Upload Image
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
              <p className="text-indigo-600 text-sm mt-2 animate-pulse">
                {uploading}
              </p>
            )}
          </div>

          {/* ================= TITLE ================= */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              name="title"
              placeholder="Enter blog title"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              onChange={handleChange}
              value={form.title}
            />
          </div>

          {/* ================= CONTENT ================= */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Content
            </label>
            <textarea
              name="content"
              placeholder="Write your blog content here..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 h-48 focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none"
              onChange={handleChange}
              value={form.content}
            />
          </div>

          {/* ================= EXCERPT ================= */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Excerpt
            </label>
            <input
              name="excerpt"
              placeholder="Short description of blog"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              onChange={handleChange}
              value={form.excerpt}
            />
          </div>

          {/* ================= CATEGORY & TAGS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category
              </label>
              <input
                name="category"
                placeholder="Technology, Business..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                onChange={handleChange}
                value={form.category}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tags
              </label>
              <input
                name="tags"
                placeholder="react, javascript, web"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                onChange={handleChange}
                value={form.tags}
              />
            </div>
          </div>

          {/* ================= SUBMIT BUTTON ================= */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateBlog;