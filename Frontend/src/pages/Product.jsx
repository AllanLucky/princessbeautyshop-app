import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaMinus, FaPlus } from 'react-icons/fa';

// Star Rating Component
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
  return (
    <div className="flex flex-col md:flex-row justify-between p-6 md:p-12 gap-8">

      {/* LEFT IMAGE */}
      <div className="flex-1 h-[1000px] w-full md:w-[600px]">
        <img
          src="/lotion2.jpg"
          alt="NATURE WELL Lavender Cream"
          className="h-full w-full object-cover rounded-lg shadow-md"
        />
      </div>

      {/* RIGHT DETAILS */}
      <div className="flex-1 flex flex-col md:ml-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          NATURE WELL Lavender Smooth & Soften Moisturizing Cream for Face & Body
        </h2>

        {/* <span className="text-gray-700 text-[16px] leading-relaxed mb-4">
          Indulge your skin with the calming and nourishing properties of lavender.
          Deeply hydrates, improves elasticity, and leaves your skin soft and revitalized.
          Suitable for daily use on face & body.
        </span> */}

        <h3 className="text-lg font-semibold mt-4 mb-2">Key Benefits:</h3>
        <ul className="list-disc list-inside text-gray-700 text-[15px] space-y-1 mb-4">
          <li>Intense hydration and skin softening</li>
          <li>Calming lavender extract to soothe the skin</li>
          <li>Enhances skin elasticity and smoothness</li>
          <li>Lightweight, non-greasy formula for all-day comfort</li>
          <li>Suitable for both face and body</li>
        </ul>

        <div className="flex items-center gap-6 mb-4">
          <span className="text-xl font-bold text-pink-600">
            Price: Kes <span>900</span>
          </span>
          <StarRating rating={4.5} />
        </div>

        <div className="h-48 w-full border-2 border-gray-300 rounded-lg shadow-md mb-4 p-4">
          <h3 className="uppercase font-semibold text-gray-700 mb-2 text-lg">What's in the box</h3>
          <hr className="mb-2" />
          <span className="text-gray-600 text-base">1 Garnier Even & Matte Vitamin C Cleansing Foam 500ml</span>
        </div>

        <div className="inline-flex items-center bg-[#ef93db] text-white font-semibold text-sm p-2 rounded-full shadow-md mb-4">
          Wholesales Available starting from 20,000
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-6">
          <FaMinus className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full text-2xl" />
          <span className="text-lg font-semibold">1</span>
          <FaPlus className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full text-2xl" />
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
          {['Mzungu Shehe', 'Stantah Kazungu', 'Stantah Kazungu', 'Stewart Junior'].map((name, index) => (
            <div key={index} className="flex items-center gap-4">
              <StarRating rating={4.5} />
              <span className="font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
