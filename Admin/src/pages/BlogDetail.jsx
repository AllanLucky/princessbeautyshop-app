import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogDetail = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH BLOG DETAIL =================
  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get(`/blogs/${id}`);
      setBlog(res.data?.blog || res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Load blog failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 animate-pulse">
          Loading blog detail...
        </p>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 font-medium">
          Blog not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {blog.title}
          </h1>

          <Link to="/admin/blogs" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
              Back
            </button>
          </Link>
        </div>

        {/* Image */}
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-52 sm:h-64 md:h-80 object-cover rounded-xl mb-6"
          />
        )}

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-gray-600 italic mb-4">
            {blog.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base sm:text-lg">
          {blog.content}
        </div>

        {/* Meta Section */}
        <div className="mt-8 border-t pt-6 text-sm text-gray-500 space-y-3">
          <p>
            <span className="font-semibold text-gray-700">
              Category:
            </span>{" "}
            {blog.category || "Uncategorized"}
          </p>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="font-semibold text-gray-700">
                Tags:
              </span>

              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p>
            <span className="font-semibold text-gray-700">
              Views:
            </span>{" "}
            {blog.views || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;