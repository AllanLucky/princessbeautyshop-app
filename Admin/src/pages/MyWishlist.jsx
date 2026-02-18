import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ================= GET MY WISHLIST =================
  const fetchWishlist = async () => {
    try {
      const res = await userRequest.get("/products/my-wishlist");
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      toast.error("Failed to load wishlist");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ================= REMOVE FROM WISHLIST =================
  const removeWishlist = async (productId) => {
    try {
      await userRequest.post(`/products/wishlist/${productId}`);
      toast.success("Removed from wishlist");
      fetchWishlist();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <ToastContainer />

      <h1 className="text-4xl font-bold text-pink-600 mb-8 text-center">
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          Your wishlist is empty
        </div>
      ) : (
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4"
            >
              <img
                src={item.img?.[0]}
                alt={item.title}
                className="h-48 w-full object-cover rounded-xl cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              />

              <h3 className="mt-3 font-semibold text-lg">{item.title}</h3>

              <p className="text-pink-600 font-bold text-lg">
                KSh {item.discountedPrice || item.originalPrice}
              </p>

              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg"
                >
                  View
                </button>

                <button
                  onClick={() => removeWishlist(item._id)}
                  className="text-red-500 text-xl"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;