import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// ⭐ Star Rating Component
const StarRating = ({ rating, maxRating = 5 }) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    if (i <= Math.floor(rating)) stars.push(<FaStar key={i} className="text-yellow-400" />);
    else if (i === Math.ceil(rating) && rating % 1 !== 0) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
  }
  return <div className="flex space-x-1 justify-center mt-1">{stars}</div>;
};

// 🛍 Product Card Component
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    img,
    desc,
    originalPrice,
    discountedPrice,
    ratings,
  } = product;

  const price = discountedPrice || originalPrice;
  const image = img?.[0] || "/placeholder.png";
  const description = desc || "No description available";

  const avgRating =
    ratings?.length > 0
      ? ratings.reduce((sum, r) => sum + r.star, 0) / ratings.length
      : 0;

  const handleClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center h-auto m-5 cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-lg bg-white rounded-xl overflow-hidden shadow-md"
    >
      {/* Product Image */}
      <img src={image} alt={title} className="w-full h-[250px] object-cover rounded-t-xl" />

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow items-center">
        <h2 className="mt-2 text-center text-xl font-semibold text-gray-800 line-clamp-2">
          {title}
        </h2>

        <p className="mt-1 text-center text-gray-600 text-sm line-clamp-3">
          {description}
        </p>

        <StarRating rating={avgRating} />

        <span className="mt-2 text-lg font-bold text-pink-600">
          KES {price ? Number(price).toLocaleString("en-KE") : "N/A"}
        </span>

        <button
          onClick={handleClick}
          className="mt-4 px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition duration-300 mb-3"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// 🏬 Shop Page Component
const Shop = ({ category, query }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products from backend
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError("");

        let url = "/products";
        if (category) url += `?category=${category}`;
        else if (query) url += `?search=${query}`;

        const res = await userRequest.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [category, query]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading products...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!products.length) return <div className="min-h-screen flex items-center justify-center text-gray-400">No products available</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Shop;