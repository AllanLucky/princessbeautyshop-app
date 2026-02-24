import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH BLOGS =================
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get("/blogs", {
        withCredentials: true,
      });

      setBlogs(res.data?.blogs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ================= DELETE BLOG =================
  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await userRequest.delete(`/blogs/${id}`, {
        withCredentials: true,
      });

      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Blog Management
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Manage, edit and create blog posts easily.
            </p>
          </div>

          {/* ✅ FIXED ROUTE */}
          <Link to="/admin/create-blog">
            <button className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 hover:scale-[1.03]">
              + Create Blog
            </button>
          </Link>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && blogs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-400">
            No blogs found. Start by creating one.
          </div>
        )}

        {/* ================= BLOG GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {blog.image && (
                <div className="overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1 justify-between">

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="text-gray-500 text-sm line-clamp-3">
                    {blog.excerpt || blog.content}
                  </p>
                </div>

                {/* ================= ACTION BUTTONS ================= */}
                <div className="flex flex-wrap gap-3 mt-6">

                  {/* ✅ PUBLIC BLOG DETAIL */}
                  <Link to={`/blog-detail/${blog._id}`}>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-lg transition shadow">
                      View
                    </button>
                  </Link>

                  {/* ✅ ADMIN EDIT BLOG */}
                  <Link to={`/blog/${blog._id}`}>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition shadow">
                      Edit
                    </button>
                  </Link>

                  {/* ✅ DELETE */}
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition shadow"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Blogs;