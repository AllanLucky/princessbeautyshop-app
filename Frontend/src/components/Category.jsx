import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";


const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await userRequest.get("/categories"); // your backend endpoint
        setCategories(res.data); // assuming backend returns array of { _id, name, image }
      } catch (err) {
        console.error("Failed to fetch categories:", err.response || err);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (categoryId) => {
    navigate(`/products/${categoryId}`); // navigate to products page for that category
  };

  return (
    <div className="flex flex-wrap items-center justify-center m-5 gap-4">
      {categories.map((cat) => (
        <div
          key={cat._id}
          onClick={() => handleClick(cat._id)}
          className="relative bg-no-repeat bg-cover bg-center h-[400px] w-full sm:w-1/2 md:w-1/3 lg:w-1/5 mx-4 my-4 sm:my-2 rounded-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:brightness-110"
          style={{ backgroundImage: `url(${cat.image})` }}
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

