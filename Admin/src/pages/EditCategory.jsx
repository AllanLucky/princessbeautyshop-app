import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialState = {
    name: "",
    description: "",
    image: "",
  };

  const [category, setCategory] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ================= FETCH CATEGORY =================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setFetching(true);
        const res = await userRequest.get(`/categories/${id}`);

        // ✅ Adjust this based on your backend response
        // Example: if backend sends { category: {...} }
        const data = res.data.category || res.data;

        if (!data || !data._id) {
          toast.error("Category not found", { autoClose: 2000 });
          navigate("/categories"); // redirect to categories list if not found
          return;
        }

        setCategory(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Category not found", {
          autoClose: 2500,
        });
        navigate("/categories"); // redirect on API error
      } finally {
        setFetching(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

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

      // ✅ navigate back after update
      setTimeout(() => navigate("/categories"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center mt-10 text-lg">Loading category...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={2500} />
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Category</h1>

      <div className="p-5 w-[77vw] overflow-hidden bg-white shadow-lg rounded-lg">
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
