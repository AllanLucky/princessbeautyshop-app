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
      toast.error(
        error.response?.data?.message || "Failed to load blogs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ================= DELETE BLOG =================
  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await userRequest.delete(`/blogs/${id}`, {
        withCredentials: true,
      });

      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center sm:text-left">
            All Blogs
          </h1>

          <Link to="/create-blog" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition shadow-md">
              + Create Blog
            </button>
          </Link>

        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading blogs...
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No blogs found.
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow-md hover:shadow-lg transition rounded-2xl overflow-hidden border flex flex-col"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5 flex flex-col flex-1 justify-between">

                <div>
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="text-sm text-gray-500 line-clamp-3">
                    {blog.excerpt || blog.content}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">

                  <Link to={`/blog-detail/${blog._id}`}>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition">
                      View
                    </button>
                  </Link>

                  <Link to={`/blog/${blog._id}`}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition"
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