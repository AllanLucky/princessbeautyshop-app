import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const ReturnDetailPage = () => {
  const { id } = useParams();
  const [ret, setRet] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReturn = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get(`/returns/${id}`);

      console.log("RETURN DETAIL:", res.data);

      setRet(res.data.return || null);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load return detail"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturn();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!ret)
    return <p className="p-6 text-gray-500">Return not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow rounded-2xl p-6 max-w-3xl mx-auto border">

        <h2 className="text-xl font-bold mb-6">
          Return Detail
        </h2>

        <p className="mb-2">
          <strong>Order:</strong>{" "}
          {ret.orderId?._id || ret.orderId}
        </p>

        <p className="mb-2">
          <strong>Product:</strong>{" "}
          {ret.productId?.title || ret.productId}
        </p>

        <p className="mb-2">
          <strong>User:</strong>{" "}
          {ret.userId?.name || ret.userId}
        </p>

        <p className="mb-2">
          <strong>Reason:</strong> {ret.reason}
        </p>

        <p className="mb-2 capitalize">
          <strong>Status:</strong> {ret.status}
        </p>

        {ret.refundAmount > 0 && (
          <p className="mb-2 text-green-600">
            Refund Amount: {ret.refundAmount}
          </p>
        )}

        {ret.adminNote && (
          <p className="mb-2 text-gray-600">
            Admin Note: {ret.adminNote}
          </p>
        )}

      </div>
    </div>
  );
};

export default ReturnDetailPage;