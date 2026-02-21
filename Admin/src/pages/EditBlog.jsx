import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const EditBlog = () => {
  const { id } = useParams();
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
  const [fetching, setFetching] = useState(true);

  // ================= FETCH BLOG =================
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setFetching(true);
        const res = await userRequest.get(`/blogs/${id}`);

        const blog = res.data?.blog;

        if (blog) {
          setForm({
            title: blog.title || "",
            content: blog.content || "",
            excerpt: blog.excerpt || "",
            image: blog.image || "",
            category: blog.category || "",
            tags: blog.tags ? blog.tags.join(", ") : "",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Load blog failed");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= UPDATE BLOG =================
  const updateBlog = async () => {
    try {
      setLoading(true);

      await userRequest.put(`/blogs/${id}`, {
        ...form,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim())
          : [],
      });

      toast.success("Blog updated successfully");

      setTimeout(() => {
        navigate("/blogs");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Edit Blog
          </h1>

          <Link to="/blogs" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
              Back
            </button>
          </Link>
        </div>

        {/* Loading State */}
        {fetching ? (
          <div className="text-center py-10 text-gray-500">
            Loading blog...
          </div>
        ) : (
          <div className="space-y-4">
            {/* Title */}
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Content */}
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Content"
              className="w-full border p-3 rounded-lg h-40 sm:h-48 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Excerpt */}
            <input
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Excerpt"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Image */}
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Image Preview */}
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            )}

            {/* Category + Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Tags (comma separated)"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={updateBlog}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBlog;