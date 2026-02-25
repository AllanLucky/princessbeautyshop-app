import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH BLOG DETAIL =================
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get(`/blogs/${id}`);
        const data = res.data?.blog || res.data; // handle API structure
        setBlog(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog detail");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 animate-pulse">Loading blog...</p>
        </div>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 font-medium">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-8 py-12 relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* X BUTTON NAVIGATE HOME */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-full p-3 shadow-md transition flex items-center justify-center"
        aria-label="Close"
      >
        <FaTimes size={18} />
      </button>

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">

        {/* Header */}
        <div className="p-6 md:p-10 border-b">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            {blog.title}
          </h1>
        </div>

        {/* Image */}
        {blog.image && (
          <div className="w-full">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 md:h-[450px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-10 space-y-6">
          {blog.excerpt && (
            <p className="text-gray-600 italic text-lg border-l-4 border-indigo-400 pl-4">
              {blog.excerpt}
            </p>
          )}

          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base md:text-lg">
            {blog.content}
          </div>

          {/* Meta */}
          <div className="pt-8 border-t grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-2">Category</p>
              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-xs md:text-sm inline-block">
                {blog.category || "Uncategorized"}
              </span>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags?.length > 0 ? (
                  blog.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No tags</span>
                )}
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-2">Views</p>
              <span className="text-gray-600">👁 {blog.views || 0} views</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogDetail;