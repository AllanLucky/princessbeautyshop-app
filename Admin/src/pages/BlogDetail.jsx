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
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get(`/blogs/${id}`);
        const data = Array.isArray(res.data)
          ? res.data[0]
          : res.data.blog || res.data;
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
          <p className="text-gray-500 animate-pulse">Loading blog detail...</p>
        </div>
      </div>
    );
  }

  // ================= BLOG NOT FOUND =================
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 font-medium">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-8 py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* ================= HEADER ================= */}
        <div className="p-6 md:p-10 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
              {blog.title}
            </h1>
            <Link to="/blogs">
              <button className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-xl transition shadow-md">
                Back to Blogs
              </button>
            </Link>
          </div>
        </div>

        {/* ================= IMAGE ================= */}
        {blog.image && (
          <div className="w-full">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 md:h-[450px] object-cover"
            />
          </div>
        )}

        {/* ================= CONTENT ================= */}
        <div className="p-6 md:p-10 space-y-6">
          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-gray-600 italic text-lg border-l-4 border-indigo-400 pl-4">
              {blog.excerpt}
            </p>
          )}

          {/* Full Content */}
          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base md:text-lg">
            {blog.content}
          </div>

          {/* ================= META INFORMATION ================= */}
          <div className="pt-8 border-t grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {/* Category */}
            <div>
              <p className="font-semibold text-gray-700 mb-2">Category</p>
              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-xs md:text-sm inline-block">
                {blog.category || "Uncategorized"}
              </span>
            </div>

            {/* Tags */}
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

            {/* Views */}
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