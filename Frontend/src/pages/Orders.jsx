import {
  FaCheckCircle,
  FaShoppingBag,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaSave,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { toast, ToastContainer } from "react-toastify";

/*
====================================================
STAR COMPONENT
====================================================
*/
const StarRating = ({ rating = 0, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1 mt-1">
      {[...Array(5)].map((_, i) => {
        const value = i + 1;
        return (
          <FaStar
            key={i}
            size={22}
            className={`cursor-pointer transition ${
              value <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
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

/*
====================================================
ORDER STATUS CONFIG
====================================================
*/
const STATUS_MAP = {
  0: "pending",
  1: "confirmed",
  2: "processing",
  3: "shipped",
  4: "delivered",
  5: "cancelled",
};

const ORDER_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

/*
====================================================
MAIN ORDERS PAGE
====================================================
*/
const Orders = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [activeProduct, setActiveProduct] = useState(null);
  const [ratingData, setRatingData] = useState({});
  const [loadingReview, setLoadingReview] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch orders
  const refreshOrders = async () => {
    if (!user?._id) return;
    try {
      const res = await userRequest.get(`/orders/user/${user._id}`);
      setOrders(Array.isArray(res?.data) ? res.data : res?.data?.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, [user?._id]);

  // Helpers
  const normalizeStatus = (status) => STATUS_MAP[status] || "";
  const getProgressPercent = (status) => {
    const normalized = normalizeStatus(status);
    const index = ORDER_STEPS.indexOf(normalized);
    return index === -1 ? 0 : ((index + 1) / ORDER_STEPS.length) * 100;
  };

  const getProgressColor = (status) => {
    const colorMap = {
      pending: "bg-gray-500",
      confirmed: "bg-blue-500",
      processing: "bg-yellow-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-600",
      cancelled: "bg-red-600",
    };
    return colorMap[normalizeStatus(status)] || "bg-gray-400";
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 text-white text-xs rounded-full ${
        getProgressColor(status)
      }`}
    >
      {normalizeStatus(status).toUpperCase()}
    </span>
  );

  const calculateRating = (ratings = []) => {
    if (!ratings || ratings.length === 0) return { avg: "0.0", total: 0 };
    const totalStars = ratings.reduce((sum, r) => sum + (r.star || 0), 0);
    return { avg: (totalStars / ratings.length).toFixed(1), total: ratings.length };
  };

  const getMyReview = (ratings = []) => ratings?.find((r) => r.postedBy === user?._id);
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount || 0);

  const submitReview = async (product) => {
    const key = product.productId;
    const data = ratingData[key] || {};
    if (!data.star) return toast.error("Please select rating");

    setLoadingReview(true);
    try {
      await userRequest.post(`/products/review/${product.productId}`, {
        star: data.star,
        comment: data.comment || "",
      });
      toast.success("Review saved successfully");
      setRatingData((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      setActiveProduct(null);
      await refreshOrders();
    } catch {
      toast.error("Review submission failed");
    } finally {
      setLoadingReview(false);
    }
  };

  if (!user?._id) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-rose-50 pt-24 pb-10 px-4">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Your Orders
          <span className="text-sm text-gray-600 block mt-2">
            Track your orders and submit product reviews.
          </span>
        </h1>

        {loadingOrders && <p className="text-center text-gray-500">Loading orders...</p>}

        {!loadingOrders && orders.length === 0 && (
          <div className="bg-white p-10 text-center rounded-xl shadow">
            <FaShoppingBag className="text-5xl mx-auto text-rose-400 mb-4" />
            <p>No orders found</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-rose-600 text-white px-6 py-3 rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow mb-6 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-rose-100 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Order #{order._id?.slice(-6)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
                <button
                  onClick={() =>
                    setExpanded((prev) => ({ ...prev, [order._id]: !prev[order._id] }))
                  }
                >
                  {expanded[order._id] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 transition-all duration-500 ${getProgressColor(order.status)}`}
                  style={{ width: `${getProgressPercent(order.status)}%` }}
                />
              </div>
            </div>

            {/* Product List */}
            {expanded[order._id] && (
              <div className="p-6 space-y-6">
                {(order.products || []).map((product) => {
                  const { avg, total } = calculateRating(product.ratings || []);
                  const myReview = getMyReview(product.ratings || []);
                  const key = product.productId;
                  const currentData = ratingData[key] || {};
                  const hasChanged = currentData.star || currentData.comment;

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
                            {formatCurrency(product.price * product.quantity)}
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
                              setActiveProduct(activeProduct === product._id ? null : product._id)
                            }
                            className="text-sm text-rose-600 mt-2 flex items-center gap-1"
                          >
                            <FaStar />
                            {myReview ? "Update Review" : "Rate Product"}
                          </button>

                          {activeProduct === product._id && (
                            <div className="mt-3 bg-rose-50 p-4 rounded">
                              <StarRating
                                rating={currentData.star || myReview?.star || 0}
                                onRatingChange={(value) =>
                                  setRatingData((prev) => ({
                                    ...prev,
                                    [key]: { ...prev[key], star: value },
                                  }))
                                }
                              />
                              <textarea
                                className="w-full mt-2 p-2 border rounded"
                                placeholder="Write your review"
                                value={currentData.comment ?? myReview?.comment ?? ""}
                                onChange={(e) =>
                                  setRatingData((prev) => ({
                                    ...prev,
                                    [key]: { ...prev[key], comment: e.target.value },
                                  }))
                                }
                              />
                              <button
                                onClick={() => submitReview(product)}
                                disabled={!hasChanged || loadingReview}
                                className={`flex items-center justify-center gap-2 px-4 py-2 mt-3 rounded text-white ${
                                  !hasChanged
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-rose-600 hover:bg-rose-700"
                                }`}
                              >
                                <FaSave />
                                {loadingReview ? "Saving..." : "Save Review"}
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
    </div>
  );
};

export default Orders;