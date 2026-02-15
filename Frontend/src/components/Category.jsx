import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/categories");

        // Ensure the API returned an array
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.warn("API did not return an array, received:", res.data);
          setCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading categories...</div>;
  }

  if (!categories.length) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No categories available.
      </div>
    );
  }

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex flex-wrap items-center justify-center gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleCategoryClick(cat.name)}
            className="relative h-[400px] w-full sm:w-1/2 md:w-1/3 lg:w-1/5 rounded-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:brightness-110"
            style={{
              backgroundImage: `url(${cat.image || "/default.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h2 className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              {cat.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
