import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialState = {
    name: "",
    description: "",
    image: "", // optional if you handle images
  };

  const [category, setCategory] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // ================= FETCH CATEGORY =================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await userRequest.get(`/categories/${id}`);
        setCategory(res.data); // populate form with existing data
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load category");
      }
    };
    fetchCategory();
  }, [id]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setCategory((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= UPDATE CATEGORY =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name) return toast.error("Category name is required");

    try {
      setLoading(true);
      await userRequest.put(`/categories/${id}`, category);
      toast.success("Category updated successfully 🎉");

      // ✅ Clear form (optional if you want)
      setCategory(initialState);

      // ✅ Navigate back after short delay
      setTimeout(() => navigate("/admin/categories"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />

      <h1 className="text-3xl font-semibold mb-6 text-center">
        Edit Category
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">

          <input
            name="name"
            value={category.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="description"
            value={category.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="image"
            value={category.image}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
