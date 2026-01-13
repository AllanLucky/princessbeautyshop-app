import { FaCheckCircle, FaShoppingBag, FaTruck, FaCreditCard, FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { userRequest } from '../requestMethod';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom StarRating Component
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
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeProduct, setActiveProduct] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  // Fetch user orders
  useEffect(() => {
    if (!user?.currentUser) return;
    const getUserOrders = async () => {
      try {
        const res = await userRequest.get(`/orders/find/${user.currentUser._id}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getUserOrders();
  }, [user]);

  const handleRating = async (productId) => {
    if (!rating) return toast.warning("Please select a rating!");

    try {
      await userRequest.post(`/products/rating/${productId}`, {
        star: rating,
        name: user.currentUser.name,
        comment,
        postedBy: user.currentUser._id,
      });
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(0);
      setActiveProduct(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review. Try again.");
    }
  };

  const calculateOrderTotal = (order) =>
    order.products.reduce((total, product) => total + product.price * product.quantity, 0);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);

  const toggleOrderExpansion = (orderId) =>
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));

  const toggleItemsExpansion = (orderId) =>
    setExpandedItems(prev => ({ ...prev, [orderId]: !prev[orderId] }));

  const getVisibleProducts = (order, orderId) =>
    expandedItems[orderId] ? order.products : order.products.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-rose-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Your Order History</h1>
          <p className="text-gray-600">Thank you for shopping with us! Here are your recent orders.</p>
        </div>

        {/* No Orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="w-12 h-12 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your order history here.</p>
            <Link to="/" className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-rose-50 p-6 border-b border-rose-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h2>
                      <p className="text-gray-600 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
                      <p className="text-gray-600 text-sm">{order.products.length} item{order.products.length !== 1 ? 's' : ''} • Total: {formatCurrency(calculateOrderTotal(order) + 500)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                        order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.paymentStatus || "Pending"}
                      </span>
                      <button onClick={() => toggleOrderExpansion(order._id)} className="text-rose-600 hover:text-rose-700 transition-colors duration-300">
                        {expandedOrders[order._id] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Order Details */}
                {expandedOrders[order._id] && (
                  <div className="p-6">
                    {/* Order Items */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaShoppingBag className="text-rose-600 mr-2" />
                      Items Ordered ({order.products.length})
                    </h3>
                    <div className="space-y-6">
                      {getVisibleProducts(order, order._id).map((product) => (
                        <div key={product._id} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <img src={product.img} alt={product.title} className="w-20 h-20 rounded-lg object-cover shadow-sm" />
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-800">{product.title}</h4>
                              <p className="text-gray-600">Quantity: {product.quantity}</p>
                              <p className="text-lg font-bold text-rose-700 mt-1">{formatCurrency(product.price * product.quantity)}</p>

                              {/* Rating Section */}
                              <div className="mt-4">
                                <button onClick={() => setActiveProduct(activeProduct === product._id ? null : product._id)} className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center">
                                  <FaStar className="mr-1" />
                                  {activeProduct === product._id ? "Cancel Review" : "Rate this Product"}
                                </button>
                                {activeProduct === product._id && (
                                  <div className="mt-3 p-4 bg-rose-50 rounded-lg">
                                    <StarRating rating={rating} onRatingChange={setRating} />
                                    <textarea
                                      placeholder="Share your experience (optional)"
                                      className="w-full mt-3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                                      rows="3"
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="flex gap-2 mt-3">
                                      <button onClick={() => handleRating(product._id)} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                                        Submit Review
                                      </button>
                                      <button onClick={() => { setActiveProduct(null); setComment(""); setRating(0); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.products.length > 2 && (
                        <div className="text-center pt-4">
                          <button onClick={() => toggleItemsExpansion(order._id)} className="text-rose-600 hover:text-rose-700 font-medium flex items-center justify-center gap-2 mx-auto">
                            {expandedItems[order._id] ? <><FaChevronUp /> Show Less</> : <><FaChevronDown /> Show All {order.products.length} Items</>}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="text-center mt-10">
            <Link to="/" className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-block">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
