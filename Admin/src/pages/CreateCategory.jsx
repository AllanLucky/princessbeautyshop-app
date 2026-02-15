import { useState } from "react";
import { userRequest } from "../requestMethods"; // axios instance
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCategory = () => {
  const navigate = useNavigate();

  const initialState = {
    name: "",
    description: "",
    image: "", // optional image url
  };

  const [category, setCategory] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setCategory((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= CREATE CATEGORY =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name) {
      return toast.error("Category name is required");
    }

    try {
      setLoading(true);

      await userRequest.post("/categories", category);

      toast.success("Category created successfully 🎉");

      // ✅ CLEAR FORM
      setCategory(initialState);

      // ✅ Navigate back after short delay
      setTimeout(() => navigate("/categories"), 800);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />

      <h1 className="text-2xl font-bold mb-5 text-center">Create New Category</h1>

      <div className="p-5 w-[77vw] overflow-hidden bg-white shadow-lg rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <input
            name="name"
            value={category.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="border rounded p-3 w-full h-14"
          />

          {/* Description */}
          <input
            name="description"
            value={category.description}
            onChange={handleChange}
            placeholder="Description"
            className="border rounded p-3 w-full h-14"
          />

          {/* Optional Image URL */}
          <input
            name="image"
            value={category.image}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="border rounded p-3 w-full h-14"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="col-span-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
