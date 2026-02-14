
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProduct } from "../redux/cartRedux";
import { FaPlus, FaMinus, FaStar } from "react-icons/fa";

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

const ProductDetails = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await userRequest.get("/products/find/" + id);
        setProduct(res.data);

        const ratingData = res.data.ratings || [];
        setReviews(ratingData);

        if (ratingData.length) {
          const total = ratingData.reduce((a, b) => a + b.star, 0);
          setAvgRating((total / ratingData.length).toFixed(1));
        }
      } catch (err) {
        console.log(err);
      }
    };

    getProduct();
  }, [id]);

  if (!product) return <p className="p-10 text-center">Loading...</p>;

  const stock = product.stock || 0;

  const unitPrice = product.discountedPrice || product.originalPrice;
  const totalPrice = unitPrice * quantity;

  const handleQuantity = (type) => {
    if (type === "dec") setQuantity((p) => (p > 1 ? p - 1 : 1));
    if (type === "inc" && quantity < stock) setQuantity((p) => p + 1);
  };

  const handleAddToCart = () => {
    dispatch(addProduct({ ...product, quantity, price: unitPrice }));
    toast.success("Added to cart");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer />

      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <img
          src={product.img?.[0]}
          className="w-full max-h-[500px] object-contain rounded-xl shadow"
        />

        {/* INFO */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600 mt-2">{product.desc}</p>

          <div className="flex items-center gap-3 mt-3">
            <StarDisplay rating={Math.round(avgRating)} />
            <span className="text-sm text-gray-600">
              {avgRating} ({reviews.length} reviews)
            </span>
          </div>

          <p className={`mt-2 font-semibold ${stock ? "text-green-600" : "text-red-600"}`}>
            {stock ? `${stock} In Stock` : "Out of Stock"}
          </p>

          <h2 className="text-3xl text-pink-600 font-bold mt-4">
            KES {totalPrice.toLocaleString()}
          </h2>

          {/* QTY */}
          <div className="flex items-center gap-4 mt-6">
            <button onClick={() => handleQuantity("dec")} className="p-2 bg-gray-200 rounded-full">
              <FaMinus />
            </button>

            <span className="font-bold">{quantity}</span>

            <button
              onClick={() => handleQuantity("inc")}
              disabled={quantity >= stock}
              className="p-2 bg-gray-200 rounded-full"
            >
              <FaPlus />
            </button>
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
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 mt-12 border-b">
        {["description", "features", "specs", "reviews"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 capitalize ${
              tab === t ? "border-b-2 border-pink-600 font-semibold" : ""
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">

        {tab === "description" && (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.desc}
          </p>
        )}

        {tab === "features" && (
          <ul className="grid md:grid-cols-2 gap-3 list-disc pl-5 text-gray-700">
            {product.features?.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}

        {tab === "specs" && (
          <div className="border rounded-lg">
            {product.specifications?.map((s, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 px-4 py-3 ${
                  i % 2 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <span className="font-medium">{s.key}</span>
                <span className="text-gray-600">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "reviews" && (
          reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="border-b py-4">
                <StarDisplay rating={r.star} />
                <p className="font-semibold">{r.name}</p>
                <p className="text-gray-600">{r.comment}</p>
              </div>
            ))
          )
        )}

      </div>
    </div>
  );
};

export default ProductDetails;