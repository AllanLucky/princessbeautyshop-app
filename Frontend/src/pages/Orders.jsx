import {
  FaCheckCircle,
  FaShoppingBag,
  FaStar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ⭐ Star Rating Component */
const StarRating = ({ rating, onRatingChange, maxRating = 5 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1 mt-1">
      {[...Array(maxRating)].map((_, i) => {
        const value = i + 1;
        return (
          <FaStar
            key={i}
            size={22}
            className={`cursor-pointer transition ${
              value <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => onRatingChange(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
};

const Orders = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [activeProduct, setActiveProduct] = useState(null);
  const [ratingData, setRatingData] = useState({});

  /* 🔄 Load Orders */
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await userRequest.get(`/orders/find/${user._id}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, [user]);

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ⭐ Ratings Helpers */
  const calculateRating = (ratings = []) => {
    if (!ratings.length) return { avg: 0, total: 0 };
    const totalStars = ratings.reduce((sum, r) => sum + r.star, 0);
    return {
      avg: (totalStars / ratings.length).toFixed(1),
      total: ratings.length,
    };
  };

  const getMyReview = (ratings = []) =>
    ratings.find((r) => r.postedBy === user?._id);

  const submitReview = async (product) => {
    const data = ratingData[product.productId];

    if (!data?.star) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await userRequest.post(`/products/rating/${product.productId}`, {
        star: data.star,
        comment: data.comment || "",
      });

      toast.success("Review saved successfully 🎉");
      setRatingData({});
      setActiveProduct(null);

      const res = await userRequest.get(`/orders/find/${user._id}`);
      setOrders(res.data);
    } catch {
      toast.error("Failed to submit review");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);

  return (
    <div className="min-h-screen bg-rose-50 pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-rose-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Orders
          </h1>
          <p className="text-gray-600">
            All orders below are successfully paid and confirmed.
          </p>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="bg-white p-10 text-center rounded-xl shadow">
            <FaShoppingBag className="text-5xl mx-auto text-rose-400 mb-4" />
            <p>No orders yet</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-rose-600 text-white px-6 py-3 rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* ORDERS LIST */}
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow mb-6">
            <div className="p-6 flex justify-between items-center bg-rose-100">
              <div>
                <h3 className="font-semibold">
                  Order #{order._id.slice(-6)}
                </h3>
                <p className="text-sm">{formatDate(order.createdAt)}</p>
                <p className="text-sm text-green-600 font-semibold">
                  Payment Status: PAID
                </p>
              </div>
              <button onClick={() => toggle(order._id)}>
                {expanded[order._id] ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </button>
            </div>

            {expanded[order._id] && (
              <div className="p-6 space-y-6">
                {/* CUSTOMER DETAILS */}
                <div className="bg-gray-50 p-4 rounded text-sm">
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment Ref: {order.paymentRef}
                  </p>
                </div>

                {/* PRODUCTS */}
                {order.products.map((product) => {
                  const { avg, total } = calculateRating(product.ratings || []);
                  const myReview = getMyReview(product.ratings || []);

                  return (
                    <div key={product._id} className="border-b pb-4">
                      <div className="flex gap-4">
                        <img
                          src={product.img}
                          className="w-20 h-20 object-cover rounded"
                          alt={product.title}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{product.title}</h4>
                          <p>Qty: {product.quantity}</p>
                          <p className="text-rose-600 font-bold">
                            {formatCurrency(
                              product.price * product.quantity
                            )}
                          </p>

                          <p className="text-yellow-500 text-sm">
                            ⭐ {avg} ({total} Reviews)
                          </p>

                          {myReview && (
                            <p className="text-sm text-green-600">
                              You rated: {myReview.star} ⭐
                            </p>
                          )}

                          <button
                            onClick={() =>
                              setActiveProduct(
                                activeProduct === product._id
                                  ? null
                                  : product._id
                              )
                            }
                            className="text-sm text-rose-600 mt-2"
                          >
                            <FaStar className="inline mr-1" />
                            {myReview ? "Update Review" : "Rate Product"}
                          </button>

                          {activeProduct === product._id && (
                            <div className="mt-3 bg-rose-50 p-4 rounded">
                              <StarRating
                                rating={
                                  ratingData[product.productId]?.star ||
                                  myReview?.star ||
                                  0
                                }
                                onRatingChange={(value) =>
                                  setRatingData({
                                    ...ratingData,
                                    [product.productId]: {
                                      ...ratingData[product.productId],
                                      star: value,
                                    },
                                  })
                                }
                              />

                              <textarea
                                className="w-full mt-2 p-2 border rounded"
                                placeholder="Write your review"
                                value={
                                  ratingData[product.productId]?.comment ||
                                  myReview?.comment ||
                                  ""
                                }
                                onChange={(e) =>
                                  setRatingData({
                                    ...ratingData,
                                    [product.productId]: {
                                      ...ratingData[product.productId],
                                      comment: e.target.value,
                                    },
                                  })
                                }
                              />

                              <button
                                onClick={() => submitReview(product)}
                                className="bg-rose-600 text-white px-4 py-2 mt-3 rounded"
                              >
                                Save Review
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Orders;

