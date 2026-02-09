import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProduct } from "../redux/cartRedux";
import { FaPlus, FaMinus, FaStar } from "react-icons/fa";

// ⭐ STAR DISPLAY
const StarDisplay = ({ rating = 0, maxRating = 5 }) => {
  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  const dispatch = useDispatch();

  // quantity
  const handleQuantity = (type) => {
    setQuantity((prev) => {
      if (type === "dec") return prev > 1 ? prev - 1 : 1;
      if (type === "inc") return prev + 1;
      return prev;
    });
  };

  // 🔥 FETCH PRODUCT
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await userRequest.get("/products/find/" + id);
        setProduct(res.data);

        const ratingData = res.data.ratings || [];

        // ⭐ show only latest review per customer
        const latestReviews = {};

        ratingData.forEach((r) => {
          const key = r.postedBy || r.name;

          if (!latestReviews[key]) {
            latestReviews[key] = r;
          } else {
            const oldDate = new Date(latestReviews[key].createdAt || 0);
            const newDate = new Date(r.createdAt || 0);

            if (newDate > oldDate) {
              latestReviews[key] = r;
            }
          }
        });

        const finalReviews = Object.values(latestReviews);
        setReviews(finalReviews);

        // ⭐ average rating
        if (ratingData.length > 0) {
          const total = ratingData.reduce((a, b) => a + b.star, 0);
          setAvgRating((total / ratingData.length).toFixed(1));
        } else {
          setAvgRating(0);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id) getProduct();
  }, [id]);

  if (!product) return <h2 className="p-10 text-center">Loading...</h2>;

  // 💰 PRICE
  const getUnitPrice = () => {
    if (
      product.wholesalePrice &&
      quantity >= product.wholesaleMinimumQuantity
    ) {
      return product.wholesalePrice;
    }

    if (product.discountedPrice) return product.discountedPrice;
    return product.originalPrice || 0;
  };

  const totalPrice = getUnitPrice() * quantity;

  // 🛒 ADD TO CART
  const handleAddToCart = () => {
    dispatch(
      addProduct({
        ...product,
        quantity,
        price: getUnitPrice(),
        total: totalPrice,
        isWholesale:
          quantity >= product.wholesaleMinimumQuantity ? true : false,
      })
    );

    toast.success("Added to cart");
  };

  // 📦 TOTAL ITEMS IN BOX
  const totalBoxItems = product.whatinbox
    ? product.whatinbox.reduce((a, b) => a + (b.qty || 1), 0)
    : 0;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 md:p-12">
      <ToastContainer />

      {/* IMAGE */}
      <div className="flex-1">
        <img
          src={product.img?.[0]}
          alt=""
          className="w-full max-h-[500px] object-contain rounded-lg shadow"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-gray-600 mt-3">{product.desc}</p>

        {/* 💰 PRICE */}
        <div className="mt-5">
          <h2 className="text-2xl font-bold text-red-600">
            KES {totalPrice}
          </h2>
        </div>

        {/* ⭐ RATING */}
        <div className="flex items-center gap-3 mt-3">
          <StarDisplay rating={Math.round(avgRating)} />
          <span className="text-sm text-gray-600">
            {avgRating} ⭐ ({reviews.length} customers reviewed)
          </span>
        </div>

        {/* 📦 WHAT IN BOX */}
        {product.whatinbox && product.whatinbox.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold text-lg mb-3">📦 What's in the box</h3>

            {product.whatinbox.map((box, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b py-2"
              >
                <span className="text-gray-700">{box.item}</span>

                <span className="bg-black text-white text-xs px-2 py-1 rounded">
                  x{box.qty}
                </span>
              </div>
            ))}

            {/* TOTAL */}
            <div className="flex justify-between mt-3 pt-3 font-semibold">
              <span>Total items</span>
              <span>{totalBoxItems}</span>
            </div>
          </div>
        )}

        {/* QUANTITY */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => handleQuantity("dec")}
            className="p-2 bg-pink-600 text-white rounded-full"
          >
            <FaMinus />
          </button>

          <span className="text-lg font-bold">{quantity}</span>

          <button
            onClick={() => handleQuantity("inc")}
            className="p-2 bg-pink-600 text-white rounded-full"
          >
            <FaPlus />
          </button>
        </div>

        {/* TOTAL */}
        <div className="mt-4 bg-yellow-50 p-3 rounded">
          <p className="font-semibold">
            Total: <span className="text-red-600">KES {totalPrice}</span>
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold"
          >
            Add to Cart
          </button>

          <button className="flex-1 bg-black text-white py-3 rounded-lg font-semibold">
            Buy Now
          </button>
        </div>

        {/* 💬 COMMENTS */}
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-3">Customer Comments</h3>

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="border-b py-3">
                <div className="flex items-center gap-2">
                  <StarDisplay rating={r.star} />
                  <span className="font-semibold text-sm">{r.name}</span>
                </div>

                <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;