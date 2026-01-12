import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";

const Category = () => {
  const [categories, setCategories] = useState([]); // make sure it's an array
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await userRequest.get("/categories"); // backend endpoint
        setCategories(res.data); // make sure res.data is an array
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center m-5 gap-4">
      {Array.isArray(categories) && categories.map((cat) => (
        <div
          key={cat._id}
          className="relative bg-cover bg-center h-[400px] w-full sm:w-1/2 md:w-1/3 lg:w-1/5 mx-4 my-4 sm:my-2 rounded-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:brightness-110"
          style={{ backgroundImage: `url(${cat.image})` }}
          onClick={() => navigate(`/products?category=${cat.name}`)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <h2 className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
            {cat.name}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default Category;
