import React, { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaMinus, FaPlus } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { userRequest } from "../requestMethod";

// ⭐ Star Rating Component
const StarRating = ({ rating, maxRating = 5 }) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }

  return <div className="flex space-x-1 mt-2">{stars}</div>;
};

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);

  // 🔄 Quantity Handler
  const handleQuantity = (action) => {
    const oldQuantity = quantity;
    let newQuantity;
    
    if (action === "dec") {
      newQuantity = quantity === 1 ? 1 : quantity - 1;
    } else if (action === "inc") {
      newQuantity = quantity + 1;
    }
    
    setQuantity(newQuantity);
  };  // 👈 added the missing closing curly brace here

  // 📦 Fetch Product
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await userRequest.get("/products/find/" + id);
        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
  }, [id]);

  // 💰 Price Calculation
const handlePrice = (
  originalPrice,
  discountedPrice,
  wholesalePrice,
  minimumQuantity,
  quantity
) => {
  let price;
  if (quantity > minimumQuantity && discountedPrice) {
    discountedPrice = wholesalePrice;
    price = discountedPrice;
    return price;
  } else if (quantity > minimumQuantity && originalPrice) {
    originalPrice = wholesalePrice;
    price = originalPrice;
    return price;
  } else if (discountedPrice) {
    price = discountedPrice;
    return price;
  } else {
    price = originalPrice;
    return price;
  }
};

  return (
    <div className="flex flex-col md:flex-row justify-between p-6 md:p-12 gap-8">

      {/* LEFT IMAGE */}
      <div className="flex-1 h-[500px] w-[600px]">
        <img
          src={product.img}
          alt={product.title}
          className="h-[100%] w-[100%] object-cover"
        />
      </div>

      {/* RIGHT DETAILS */}
      <div className="flex-1 flex flex-col md:ml-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-[20px]">
          {product.title}
        </h2>

        <span>{product.desc}</span>

        {/* Price + Rating */}
        <div className="flex items-center gap-6 mb-4">
          <h2 className="font-semibold mt-2 text-[20px] text-red-700">
            KES{" "}
            {handlePrice(
              product.originalPrice,
              product.discountedPrice,
              product.wholesalePrice,
              product.minimumQuantity,
              quantity
            ) * quantity}
          </h2>
          <StarRating rating={4.5} />
        </div>

        {/* What's in the box */}
        <div className="h-48 w-full border-2 border-gray-300 rounded-lg shadow-md mb-4 p-4">
          <h3 className="uppercase font-semibold text-gray-700 mb-2 text-lg">
            What's in the box
          </h3>
          <hr className="mb-2" />
          <span className="text-gray-600 text-base">
            {product.title}
          </span>
        </div>

        {/* Wholesale Info */}
        <div className="inline-flex items-center bg-[#ef93db] text-white font-semibold text-sm p-2 rounded-full shadow-md mb-4">
          Wholesales Available : KES{product.wholesalePrice} as from {product.minimumQuantity} items
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-6">
          <FaMinus
            className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full text-2xl"
            onClick={() => handleQuantity("dec")}
          />
          <span className="text-lg font-semibold">{quantity}</span>
          <FaPlus
            className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full text-2xl"
            onClick={() => handleQuantity("inc")}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="flex-1 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition duration-300">
            Add to Cart
          </button>
          <button className="flex-1 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition duration-300">
            Buy Now
          </button>
        </div>

        <hr className="my-6" />

        {/* Reviews */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg">Reviews</h3>
          {["Mzungu Shehe", "Stantah Kazungu", "Stewart Junior"].map(
            (name, index) => (
              <div key={index} className="flex items-center gap-4">
                <StarRating rating={4.5} />
                <span className="font-semibold">{name}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
