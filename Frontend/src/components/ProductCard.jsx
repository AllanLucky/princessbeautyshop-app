import React from "react";
import { useNavigate } from "react-router-dom";
import { showAverageRating } from "./Ratings";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // 🛑 Prevent crash if product is undefined
  if (!product || !product._id) return null;

  const {
    _id,
    title = "No Title",
    img = [],
    desc = "",
    originalPrice = 0,
    discountedPrice = 0,
  } = product;

  // ✅ Check discount properly
  const hasDiscount =
    Number(discountedPrice) > 0 &&
    Number(originalPrice) > 0 &&
    Number(discountedPrice) < Number(originalPrice);

  const finalPrice = hasDiscount
    ? Number(discountedPrice)
    : Number(originalPrice);

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(originalPrice) - Number(discountedPrice)) /
          Number(originalPrice)) *
          100
      )
    : 0;

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* ================= IMAGE ================= */}
      <div className="relative h-[250px] overflow-hidden bg-gray-50">
        <img
          src={img[0] || "/placeholder.png"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* ================= INFO ================= */}
      <div className="p-5 flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[48px]">
          {title}
        </h2>

        {/* Rating (MUI) */}
        {showAverageRating(product)}

        {/* Price */}
        <div className="mt-3 flex flex-col items-center">
          <span className="text-xl font-bold text-pink-600">
            KES {finalPrice.toLocaleString("en-KE")}
          </span>

          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              KES {Number(originalPrice).toLocaleString("en-KE")}
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent double navigation
            navigate(`/product/${_id}`);
          }}
          className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;