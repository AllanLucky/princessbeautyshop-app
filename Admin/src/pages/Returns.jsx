import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  =====================================
  FETCH RETURNS
  =====================================
  */

  const fetchReturns = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get("/returns");

      console.log("RETURNS RESPONSE:", res.data);

      // ✅ Handles both response formats
      if (Array.isArray(res.data)) {
        setReturns(res.data);
      } else {
        setReturns(res.data.returns || []);
      }
    } catch (error) {
      console.log(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to load returns"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================
  UPDATE RETURN STATUS
  =====================================
  */

  const updateReturnStatus = async (id, status) => {
    try {
      await userRequest.put(`/returns/${id}`, { status });

      toast.success("Return updated");
      fetchReturns();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Return Requests
      </h1>

      {/* ✅ Loading */}
      {loading && (
        <p className="text-gray-500">Loading returns...</p>
      )}

      {/* ✅ Empty State */}
      {!loading && returns.length === 0 && (
        <p className="text-gray-500">
          No return requests found.
        </p>
      )}

      <div className="grid gap-6 mt-4">
        {returns.map((ret) => (
          <div
            key={ret._id}
            className="bg-white shadow rounded-2xl p-6 border"
          >
            <p className="font-semibold">
              Order:{" "}
              {ret.orderId?._id || ret.orderId}
            </p>

            {ret.userId && (
              <p className="text-sm text-gray-600">
                User:{" "}
                {ret.userId.name || "Unknown"} (
                {ret.userId.email || "No email"})
              </p>
            )}

            <p className="text-sm text-gray-600 mt-2">
              Reason: {ret.reason}
            </p>

            <p className="mt-3">
              Status:
              <span
                className={`ml-2 px-3 py-1 rounded-full text-xs capitalize ${
                  statusColor[ret.status] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {ret.status}
              </span>
            </p>

            <div className="flex gap-3 mt-5 flex-wrap">
              {[
                "approved",
                "rejected",
                "processing",
                "completed",
              ].map((st) => (
                <button
                  key={st}
                  onClick={() =>
                    updateReturnStatus(ret._id, st)
                  }
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm capitalize"
                >
                  {st}
                </button>
              ))}

              <Link
                to={`/return/${ret._id}`}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm"
              >
                View Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Returns;