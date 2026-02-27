import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProduct } from "../redux/cartRedux";
import {
  FaPlus,
  FaMinus,
  FaStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

/* ================= STAR COMPONENT ================= */
const StarDisplay = ({ rating = 0, maxRating = 5 }) => (
  <div className="flex gap-1">
    {[...Array(maxRating)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ))}
  </div>
);

/* ================= PRODUCT DETAILS ================= */
const ProductDetails = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState({ type: null, value: 0 });
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userRequest.get(`/products/find/${id}`);
        setProduct(res.data);

        const ratingData = res.data.ratings || [];
        setReviews(ratingData);

        if (ratingData.length) {
          const total = ratingData.reduce((a, b) => a + b.star, 0);
          setAvgRating((total / ratingData.length).toFixed(1));
        }

        const wishRes = await userRequest.get("/products/my-wishlist");
        setWishlist(wishRes.data.wishlist || []);
      } catch (err) {
        toast.error(err,"Failed to fetch product details");
      }
    };

    fetchData();
  }, [id]);

  if (!product)
    return (
      <p className="p-10 text-center text-lg font-medium">Loading...</p>
    );

  const stock = product.stock || 0;
  const isOutOfStock = stock <= 0;

  const unitPrice = product.discountedPrice || product.originalPrice;
  const subtotal = unitPrice * quantity;

  // ================= PRICE ENGINE =================
  let totalPrice = subtotal;

  if (discount.type === "percentage") {
    totalPrice = subtotal - (subtotal * discount.value) / 100;
  } else if (discount.type === "fixed") {
    totalPrice = subtotal - discount.value;
  }

  // Prevent negative price
  totalPrice = Math.max(totalPrice, 0);

  // ================= QUANTITY =================
  const handleQuantity = (type) => {
    if (isOutOfStock) return;

    if (type === "dec") setQuantity((p) => (p > 1 ? p - 1 : 1));
    if (type === "inc" && quantity < stock)
      setQuantity((p) => p + 1);
  };

  // ================= ADD TO CART =================
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    dispatch(addProduct({ ...product, quantity, price: totalPrice }));
    toast.success("Added to cart");
  };

  // ================= COUPON =================
  const applyCoupon = async () => {
    if (isOutOfStock) return;

    if (!coupon) {
      toast.error("Please enter coupon code");
      return;
    }

    try {
      const res = await userRequest.post("/coupons/validate", {
        code: coupon,
        orderAmount: subtotal,
      });

      if (res.data.valid) {
        setDiscount({
          type: res.data.discountType,
          value: res.data.discountValue,
        });

        toast.success("Coupon applied");
      } else {
        setDiscount({ type: null, value: 0 });
        toast.error(res.data.message || "Invalid coupon");
      }
    } catch {
      toast.error("Coupon validation failed");
    }
  };

  // ================= WISHLIST =================
  const inWishlist = wishlist.some((item) => item._id === product._id);

  const toggleWishlist = async () => {
    try {
      setLoadingWishlist(true);

      await userRequest.post(`/products/wishlist/${product._id}`);

      if (inWishlist) {
        setWishlist((prev) =>
          prev.filter((i) => i._id !== product._id)
        );
        toast.info("Removed from wishlist");
      } else {
        setWishlist((prev) => [...prev, product]);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Wishlist update failed");
    } finally {
      setLoadingWishlist(false);
    }
  };

  // ================= BACK IN STOCK NOTIFICATION =================
  const notifyBackInStock = async () => {
    try {
      setNotifyLoading(true);

      await userRequest.post(`/products/notify-stock/${product._id}`);

      toast.success("You will be notified when product is back");
    } catch {
      toast.error("Notification request failed");
    } finally {
      setNotifyLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ===== PRODUCT GRID ===== */}
      <div className="grid md:grid-cols-2 gap-10 relative">
        {/* IMAGE + SOLD OUT BADGE */}
        <div className="relative">
          <img
            src={product.img?.[0]}
            alt={product.title}
            className="w-full max-h-[500px] object-contain rounded-xl shadow"
          />

          {isOutOfStock && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-semibold">
              Sold Out
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.title}</h1>

          <p className="text-gray-600 mt-2">{product.desc}</p>

          <div className="flex items-center gap-3 mt-3">
            <StarDisplay rating={Math.round(avgRating)} />

            <span className="text-sm text-gray-600">
              {avgRating} ({reviews.length})
            </span>
          </div>

          <p
            className={`mt-2 font-semibold ${
              isOutOfStock ? "text-red-600" : "text-green-600"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : `${stock} In Stock`}
          </p>

          <h2 className="text-3xl text-rose-600 font-bold mt-4">
            KES {totalPrice.toLocaleString()}
          </h2>

          {/* COUPON */}
          <div className="flex gap-3 mt-4">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
              disabled={isOutOfStock}
              className="flex-1 border rounded-lg px-3 py-2"
            />

            <button
              onClick={applyCoupon}
              disabled={isOutOfStock}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>

          {/* QUANTITY */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => handleQuantity("dec")}
                className="p-2 bg-gray-200 rounded-full"
              >
                <FaMinus />
              </button>

              <span className="font-bold">{quantity}</span>

              <button
                onClick={() => handleQuantity("inc")}
                disabled={quantity >= stock}
                className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
              >
                <FaPlus />
              </button>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mt-6">
            {!isOutOfStock && (
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-rose-600 text-white py-3 rounded-lg hover:bg-pink-700 transition"
              >
                Add to Cart
              </button>
            )}

            {isOutOfStock && (
              <button
                onClick={notifyBackInStock}
                disabled={notifyLoading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
              >
                Notify Me When Available
              </button>
            )}

            <button
              onClick={toggleWishlist}
              disabled={loadingWishlist}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
            >
              {inWishlist ? "Remove Wishlist" : "Add Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;