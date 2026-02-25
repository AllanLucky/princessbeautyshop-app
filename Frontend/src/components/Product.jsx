import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// 🛍 Product Card Component
const Product = ({ id, name, price, image, rating = 0, description }) => {
  
  // ✅ Format price safely
  const formattedPrice =
    price !== undefined && price !== null
      ? Number(price).toLocaleString("en-KE")
      : "N/A";

  // ✅ Generate Stars Directly Here
  const stars = [];
  const maxRating = 5;

  for (let i = 1; i <= maxRating; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }

  return (
    <div
      key={id}
      className="flex flex-col items-center justify-center h-auto m-5 cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-lg"
    >
      {/* Product Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-[250px] object-cover rounded-lg shadow-md"
      />

      {/* Product Name */}
      <h2 className="mt-2 text-center text-xl font-semibold text-gray-800">
        {name}
      </h2>

      {/* Description */}
      <p className="mt-1 text-center text-gray-600 text-sm">
        {description}
      </p>

      {/* ⭐ Rating */}
      <div className="flex space-x-1 justify-center mt-2">
        {stars}
      </div>

      {/* Price */}
      <span className="mt-2 text-lg font-bold text-pink-600">
        Price: KES <span>{formattedPrice}</span>
      </span>

      {/* Buy Button */}
      <button className="mt-4 px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition duration-300 mb-3">
        Buy Now
      </button>
    </div>
  );
};

export default Product;