import { FaCheckCircle, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

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

const Orders = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">

        {/* Thank You Section */}
        <div className="text-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-700">Thank You for Your Order</h1>
          <p className="text-gray-600 mt-2">Here are the details of your order</p>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-4">
          <h2 className="text-2xl font-extrabold mb-4">Order #1</h2>

          <div className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4">
            {/* Product Image */}
            <img
              src="/lotion.jpg"
              alt="NATURE WELL Lavender Cream"
              className="h-32 w-32 md:h-24 md:w-24 rounded-md object-cover mx-auto md:mx-0"
            />

            {/* Product Details */}
            <div className="flex-1 md:ml-4 text-center md:text-left">
              <h4 className="text-lg font-bold">
                NATURE WELL Lavender Smooth & Soften Moisturizing Cream for Face & Body
              </h4>
              <p className="text-gray-600 mt-1">Quantity: 5</p>
            </div>

            {/* Price */}
            <div className="text-center md:text-right">
              <p className="text-xl font-bold text-pink-600">KES 900</p>
            </div>
          </div>

          {/* Rating & Review */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-semibold mb-1">Rate this Product</h3>
              <StarRating rating={4.5} />
            </div>
            <div className="flex flex-col w-full md:w-auto">
              <textarea
                className="p-3 border rounded-md w-full md:w-72 resize-none"
                placeholder="Leave your message"
              />
              <button className="bg-pink-600 text-white font-semibold rounded-md mt-3 py-2 px-4 hover:bg-pink-700 transition">
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-1">
          <h3 className="text-xl font-semibold mb-2">Shipping Information</h3>
          <p className="text-gray-600">Name: Allan Lucky</p>
          <p className="text-gray-600">Email: luckytsori8@gmail.com</p>
          <p className="text-gray-600">Phone: +25488425000</p>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-1">
          <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
          <p className="text-gray-600">VISA</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-2">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Subtotal:</span>
            <span className="text-lg font-semibold">KES 700</span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-semibold">KES 1000</span>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-6 text-center">
          <Link to="/">
            <button className="bg-[#ef93db] text-white p-3 rounded-lg font-semibold hover:bg-[#e455c5] transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Orders;
