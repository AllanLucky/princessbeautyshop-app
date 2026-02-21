import { useState } from "react";
import { userRequest } from "../requestMethods";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    category: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= SUBMIT BLOG =================
  const submitBlog = async () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setLoading(true);

      await userRequest.post(
        "/blogs",
        {
          ...form,
          tags: form.tags
            ? form.tags.split(",").map((t) => t.trim())
            : [],
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Blog created successfully");

      setTimeout(() => {
        navigate("/blogs");
      }, 1000);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Create blog failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start px-3 sm:px-6 py-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Add New Blog
          </h1>

          <Link to="/blogs" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
              Back
            </button>
          </Link>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            name="title"
            placeholder="Blog title"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            onChange={handleChange}
            value={form.title}
          />

          <textarea
            name="content"
            placeholder="Blog content"
            className="w-full border p-3 rounded-lg h-40 sm:h-48 focus:ring-2 focus:ring-pink-400 outline-none"
            onChange={handleChange}
            value={form.content}
          />

          <input
            name="excerpt"
            placeholder="Excerpt"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            onChange={handleChange}
            value={form.excerpt}
          />

          <input
            name="image"
            placeholder="Image URL"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            onChange={handleChange}
            value={form.image}
          />

          {/* Grid Category + Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="category"
              placeholder="Category"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
              onChange={handleChange}
              value={form.category}
            />

            <input
              name="tags"
              placeholder="Tags (comma separated)"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
              onChange={handleChange}
              value={form.tags}
            />
          </div>

          <button
            onClick={submitBlog}
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;