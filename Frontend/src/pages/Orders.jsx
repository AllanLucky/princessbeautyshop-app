import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethod";
import { useSelector } from "react-redux";

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
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
};

const Orders = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState({}); // { productId: rating }
  const [comments, setComments] = useState({}); // { productId: comment }

  // Fetch current user's orders
  useEffect(() => {
    if (!currentUser) return; // wait for user to load
    const getUserOrders = async () => {
      try {
        const res = await userRequest.get(`/orders/find/${currentUser._id}`);
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserOrders();
  }, [currentUser]);

  const handleRatingSubmit = async (productId) => {
    if (!currentUser) return;

    try {
      const singleRating = {
        star: ratings[productId],
        name: currentUser.name,
        postedBy: currentUser._id,
        comment: comments[productId] || "",
      };
      await userRequest.put(`/products/rating/${productId}`, singleRating);

      // Clear rating & comment for that product
      setRatings((prev) => ({ ...prev, [productId]: 0 }));
      setComments((prev) => ({ ...prev, [productId]: "" }));
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentUser) return <p>Loading user...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-4 md:p-6 space-y-8">

        {/* Thank You Section */}
        <div className="text-center mb-6">
          <FaStar className="text-green-500 text-7xl mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-700">
            Thank You for Your Order
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Here are the details of your purchase
          </p>
        </div>

        {/* Orders */}
        {orders.map((order) => (
          <div key={order._id} className="bg-gray-50 p-4 md:p-5 rounded-xl shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4 flex flex-wrap items-center">
              <span className="text-xl font-medium">Order</span>
              <span className="text-pink-600 ml-2 break-words">#{order._id}</span>
            </h2>

            <div className="text-lg font-semibold mb-3">
              <h3 className="mb-3 text-gray-800">Items Ordered</h3>
              <div className="flex flex-col space-y-4">
                {order.products?.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-b-0"
                  >
                    <img
                      src={product.img}
                      alt={product.title}
                      className="h-32 w-32 md:h-24 md:w-24 rounded-md object-contain mx-auto md:mx-0"
                    />
                    <div className="flex-1 md:ml-4 text-center md:text-left">
                      <h4 className="text-lg font-bold text-gray-800">{product.title}</h4>
                      <p className="text-gray-600 mt-1">Quantity: {product.quantity}</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-xl font-bold text-pink-600">{product.price}</p>
                    </div>

                    {/* Rating & Review */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-wrap gap-4 mt-4 w-full md:w-auto">
                      <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-semibold text-gray-700 mb-1">Rate this Product</h3>
                        <StarRating
                          rating={ratings[product._id] || 0}
                          onRatingChange={(value) =>
                            setRatings((prev) => ({ ...prev, [product._id]: value }))
                          }
                        />
                      </div>
                      <div className="flex flex-col w-full md:w-72 mt-2 md:mt-0">
                        <textarea
                          className="p-3 border rounded-md w-full resize-none focus:ring-2 focus:ring-pink-300 focus:outline-none"
                          placeholder="Leave your message"
                          value={comments[product._id] || ""}
                          onChange={(e) =>
                            setComments((prev) => ({ ...prev, [product._id]: e.target.value }))
                          }
                        />
                        <button
                          className="bg-pink-600 text-white font-semibold rounded-md mt-3 py-2 px-4 hover:bg-pink-700 transition w-full md:w-auto"
                          onClick={() => handleRatingSubmit(product._id)}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Shipping Info */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-2">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Shipping Information</h3>
          <p className="text-gray-600">Name: {currentUser.name}</p>
          <p className="text-gray-600">Email: {currentUser.email}</p>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-2">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Payment Method</h3>
          <p className="text-gray-600">VISA</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-3">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Order Summary</h3>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
            <span className="text-lg font-semibold text-gray-700">KES 700</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-lg font-semibold text-gray-700">Total:</span>
            <span className="text-lg font-semibold text-gray-700">KES 1000</span>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-6 text-center">
          <Link to="/">
            <button className="bg-[#ef93db] text-white p-3 rounded-lg font-semibold hover:bg-[#e455c5] transition w-full sm:w-auto">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Orders;
