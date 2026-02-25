import { useEffect, useState } from "react";
import { userRequest } from "../requestMethod";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH ALL BLOGS =================
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await userRequest.get("/blogs");
      const allBlogs = res.data?.blogs || [];
      setBlogs(allBlogs);
    } catch (err) {
      console.error(err);
      setError("Failed to load blogs");
      toast.error("Failed to load blogs");
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
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading blogs...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-8 py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            All Blogs
          </h1>
        </div>

        {/* Empty State */}
        {!blogs.length && (
          <p className="text-center text-gray-400">No blogs available</p>
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

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 flex-grow">
                  {blog.excerpt || blog.content}
                </p>

                {/* Read More */}
                <Link
                  to={`/blog-detail/${blog._id}`}
                  className="mt-4 inline-block text-pink-600 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;