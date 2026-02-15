import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initial form state
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

        // Fetch single category
        const res = await userRequest.get(`/categories/${id}`);

        // Backend returns { success: true, data: category }
        const data = res.data?.data;

        if (!data || !data._id) {
          toast.error("Category not found", { autoClose: 2000 });
          setTimeout(() => navigate("/categories"), 1500);
          return;
        }

        // Populate form
        setCategory({
          name: data.name || "",
          description: data.description || "",
          image: data.image || "",
        });
      } catch (err) {
        toast.error(err.response?.data?.message || "Category not found", {
          autoClose: 2500,
        });
        setTimeout(() => navigate("/categories"), 5000);
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

    if (!category.name) {
      return toast.error("Category name is required");
    }

    try {
      setLoading(true);

      // Update category
      const res = await userRequest.put(`/categories/${id}`, category);

      if (res.data?.success) {
        toast.success("Category updated successfully 🎉");
        setTimeout(() => navigate("/categories"), 800);
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center mt-10 text-lg">
        Loading category...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold float-start">Edit Category</h1>
        <Link to="/categories">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg float-end">
            Back
          </button>
        </Link>
      </div>

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
