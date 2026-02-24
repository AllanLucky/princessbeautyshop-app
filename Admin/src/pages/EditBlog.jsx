import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
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

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ================= IMAGE CHANGE =================
  const imageChange = (e) => {
    if (e.target.files?.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => setSelectedImage(null);

  // ================= FETCH BLOG =================
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setFetching(true);
        const res = await userRequest.get(`/blogs/${id}`, { withCredentials: true });
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
  const updateBlog = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = form.image;

      if (selectedImage) {
        setUploading(true);
        const data = new FormData();
        data.append("file", selectedImage);
        data.append("upload_preset", "uploads");
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
          data
        );
        imageUrl = uploadRes.data.secure_url;
      }

      await userRequest.put(
        `/blogs/${id}`,
        {
          ...form,
          image: imageUrl,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        },
        { withCredentials: true }
      );

      toast.success("Blog updated successfully 🚀");
      setTimeout(() => navigate("/blogs"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Edit Blog</h1>
          <Link to="/blogs">
            <button className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-xl transition">
              Back to Blogs
            </button>
          </Link>
        </div>

        {fetching ? (
          <div className="text-center py-12 text-gray-500">Loading blog...</div>
        ) : (
          <form className="space-y-6" onSubmit={updateBlog}>
            {/* IMAGE SECTION */}
            <div>
              <label className="block font-semibold mb-3">Blog Image</label>
              <div className="relative w-full sm:w-64 h-48 border-2 border-dashed rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50">
                {selectedImage ? (
                  <>
                    <img src={URL.createObjectURL(selectedImage)} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                    >
                      <FaTrash size={14} />
                    </button>
                  </>
                ) : form.image ? (
                  <>
                    <img src={form.image} alt="existing" className="w-full h-full object-cover" />
                    <label
                      htmlFor="file"
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition"
                    >
                      Change Image
                    </label>
                  </>
                ) : (
                  <label htmlFor="file" className="flex flex-col items-center text-gray-500 cursor-pointer">
                    <FaPlus className="text-3xl mb-2" />
                    Upload Image
                  </label>
                )}
                <input type="file" id="file" hidden onChange={imageChange} />
              </div>
              {uploading && <p className="text-green-600 text-sm mt-2">Uploading new image...</p>}
            </div>

            {/* TITLE */}
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Blog Title"
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            {/* CONTENT */}
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Blog Content"
              className="w-full border p-4 rounded-xl h-44 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            {/* EXCERPT */}
            <input
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Short Excerpt"
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* CATEGORY + TAGS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="border p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Tags (comma separated)"
                className="border p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditBlog;