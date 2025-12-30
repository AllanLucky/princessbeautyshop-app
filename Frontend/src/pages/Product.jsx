import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProduct } from "../redux/cartRedux";
import { FaPlus, FaMinus, FaStar } from "react-icons/fa";

// Interactive Star Rating Component
const StarRating = ({ rating, onRatingChange, maxRating = 5 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1 mt-1">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        return (
          <FaStar
            key={i}
            size={25}
            className={`cursor-pointer transition-colors ${
              starValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => onRatingChange && onRatingChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
};

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // Increment & Decrement
  const handleQuantity = (action) => {
    setQuantity((prev) => {
      if (action === "dec") return prev > 1 ? prev - 1 : 1;
      if (action === "inc") return prev + 1;
      return prev;
    });
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await userRequest.get("/products/find/" + id);
        setProduct(response.data);
        setReviews(response.data.ratings || []);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [id]);

  const handlePrice = (
    originalPrice,
    discountedPrice,
    wholesalePrice,
    minimumQuantity,
    quantity
  ) => {
    if (quantity > minimumQuantity && wholesalePrice) return wholesalePrice;
    if (discountedPrice) return discountedPrice;
    return originalPrice;
  };

  const handleAddToCart = () => {
    const price = handlePrice(
      product.originalPrice,
      product.discountedPrice,
      product.wholesalePrice,
      product.minimumQuantity,
      quantity
    );

    dispatch(addProduct({ ...product, quantity, price }));

    toast.success("Product has been added to basket successfully", {
      position: "top-right",
      autoClose: 5000,
    });

    console.log(cart);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between p-4 sm:p-6 md:p-12 gap-8">
      <ToastContainer />

      {/* LEFT IMAGE */}
      <div className="flex-1 w-full md:w-1/2">
        <img
          src={product.img}
          alt={product.title}
          className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
        />
      </div>

      {/* RIGHT DETAILS */}
      <div className="flex-1 flex flex-col md:ml-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          {product.title}
        </h2>

        <span className="text-gray-700 text-sm sm:text-base mb-4">
          {product.desc}
        </span>

        {/* PRICE + RATING */}
        <div className="flex items-center gap-4 mb-4">
          <h2 className="font-semibold text-lg sm:text-xl text-red-700">
            KES{" "}
            {handlePrice(
              product.originalPrice,
              product.discountedPrice,
              product.wholesalePrice,
              product.minimumQuantity,
              quantity
            ) * quantity}
          </h2>

          {/* ✅ Render average rating */}
          <StarRating
            rating={
              reviews.length
                ? reviews.reduce((acc, r) => acc + r.star, 0) / reviews.length
                : 0
            }
          />
        </div>

        {/* QUANTITY CONTROLS */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => handleQuantity("dec")}
            className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
          >
            <FaMinus />
          </button>

          <span className="text-lg font-semibold">{quantity}</span>

          <button
            onClick={() => handleQuantity("inc")}
            className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
          >
            <FaPlus />
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleAddToCart}
            className="flex-1 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition"
          >
            Add to Cart
          </button>

          <button className="flex-1 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition">
            Buy Now
          </button>
        </div>

        {/* REVIEWS */}
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="font-semibold text-base sm:text-lg">Reviews</h3>

          {reviews.length ? (
            reviews.map((rev, index) => (
              <div key={index} className="flex items-center gap-3">
                <StarRating rating={rev.star} />
                <span className="font-semibold text-sm">{rev.name}</span>
                <span className="text-gray-600 text-sm">
                  – {rev.comment}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
