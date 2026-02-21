import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
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
  const [uploading, setUploading] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ================= IMAGE CHANGE =================
  const imageChange = (e) => {
    if (e.target.files?.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // ================= FETCH BLOG =================
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setFetching(true);

        const res = await userRequest.get(`/blogs/${id}`, {
          withCredentials: true,
        });

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
      setUploading("Uploading image...");

      let imageUrl = form.image;

      // Upload new image if selected
      if (selectedImage) {
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
          tags: form.tags
            ? form.tags.split(",").map((t) => t.trim())
            : [],
        },
        { withCredentials: true }
      );

      toast.success("Blog updated successfully");

      setTimeout(() => navigate("/blogs"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
      setUploading("");
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Edit Blog</h1>

          <Link to="/blogs">
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
              Back
            </button>
          </Link>
        </div>

        {fetching ? (
          <div className="text-center py-10 text-gray-500">
            Loading blog...
          </div>
        ) : (
          <form className="space-y-4" onSubmit={updateBlog}>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="font-semibold block mb-2">
                Blog Image
              </label>

              <div className="relative w-32 h-32 border rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">

                {!selectedImage ? (
                  <label htmlFor="file" className="flex flex-col items-center text-gray-500 cursor-pointer">
                    <FaPlus className="text-2xl mb-1" />
                    Change Image
                  </label>
                ) : (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                )}

                <input
                  type="file"
                  id="file"
                  hidden
                  onChange={imageChange}
                />
              </div>

              {uploading && (
                <p className="text-green-600 text-sm mt-1">
                  {uploading}
                </p>
              )}
            </div>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border p-3 rounded-lg"
            />

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Content"
              className="w-full border p-3 rounded-lg h-40"
            />

            <input
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Excerpt"
              className="w-full border p-3 rounded-lg"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="border p-3 rounded-lg"
              />

              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Tags (comma separated)"
                className="border p-3 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition disabled:opacity-60"
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