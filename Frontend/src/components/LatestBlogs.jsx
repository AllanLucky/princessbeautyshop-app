import { useEffect, useState } from "react";
import { userRequest } from "../requestMethod";
import { Link, useLocation } from "react-router-dom";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  // ================= FETCH LATEST BLOGS =================
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await userRequest.get("/blogs");

      // Ensure blogs array exists
      const allBlogs = Array.isArray(res.data)
        ? res.data
        : res.data.blogs || [];

      // Take only latest 3 blogs
      setBlogs(allBlogs.slice(0, 3));
    } catch (err) {
      console.error(err);
      setError("Failed to load latest blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading latest blogs...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen px-4 py-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Latest Blogs</h2>

        <Link
          to={location.pathname.startsWith("/admin") ? "/admin/blogs" : "/blogs"}>
          <button className="mt-4 px-6 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition duration-300 mb-3">
           View All
      </button>
        </Link>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {!blogs.length && (
        <p className="text-center text-gray-400">No blogs available</p>
      )}

      {/* ================= BLOG GRID ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
          >
            {/* Blog Image */}
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="h-52 w-full object-cover"
              />
            )}

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {blog.title}
              </h3>

              <p className="text-gray-500 text-sm line-clamp-3 flex-grow">
                {blog.excerpt || blog.content}
              </p>

              {/* Read More */}
              <Link
                to={
                  location.pathname.startsWith("/admin")
                    ? `/admin/blog-detail/${blog._id}`
                    : `/blog-detail/${blog._id}`
                }
                className="mt-4 inline-block text-pink-600 font-semibold hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestBlogs;