import { useEffect, useState } from "react";
import { userRequest } from "../requestMethod";
import { Link, useLocation } from "react-router-dom";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  // ================= FETCH BLOGS =================
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await userRequest.get("/blogs");

      const allBlogs = res.data?.blogs || [];

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

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading latest blogs...
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">

        <h2 className="text-3xl font-bold text-gray-800">
          Latest Blogs
        </h2>

        {/* View All */}
        <Link
          to={location.pathname.startsWith("/admin")
            ? "/admin/blogs"
            : "/blogs"}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl transition w-full sm:w-auto text-center"
        >
          View All →
        </Link>

      </div>

      {/* Empty State */}
      {!blogs.length && (
        <p className="text-center text-gray-400">
          No blogs available
        </p>
      )}

      {/* Blog Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
          >

            {/* Image */}
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
                to={location.pathname.startsWith("/admin")
                  ? `/admin/blog-detail/${blog._id}`
                  : `/blog-detail/${blog._id}`}
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