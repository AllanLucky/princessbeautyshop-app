import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductReviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        const res = await userRequest.get(`/products/reviews/${id}`);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-[77vw]">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/products">
          <FaArrowLeft className="text-xl cursor-pointer" />
        </Link>
        <h1 className="text-2xl font-bold">Product Reviews</h1>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-20 text-lg">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <FaStar className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">No reviews yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow p-5 border hover:shadow-lg transition"
            >
              {/* USER */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold">{r.name}</h3>
                  <p className="text-sm text-gray-500">{r.email}</p>
                </div>

                {/* STARS */}
                <div className="flex items-center gap-1">
                  {[...Array(r.star)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
              </div>

              {/* COMMENT */}
              <p className="text-gray-700 mt-2">{r.comment}</p>

              {/* DATE */}
              <p className="text-xs text-gray-400 mt-3">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;