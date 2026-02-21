import { useEffect, useState, useCallback } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /*
  ====================================================
  FETCH RETURNS
  ====================================================
  */

  const fetchReturns = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await userRequest.get("/returns");

      const data = res.data?.returns || [];

      setReturns(Array.isArray(data) ? data : []);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load returns";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  /*
  ====================================================
  UPDATE RETURN STATUS
  ====================================================
  */

  const updateReturnStatus = async (id, status) => {
    if (!window.confirm(`Set return status to ${status}?`)) return;

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

  /*
  ====================================================
  STATUS STYLE MAP
  ====================================================
  */

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-purple-100 text-purple-700",
  };

  /*
  ====================================================
  RENDER
  ====================================================
  */

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      <ToastContainer />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">
          Return Requests
        </h1>

        <Link to="/create-return">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
            + Create Return
          </button>
        </Link>
      </div>

      {loading && (
        <p className="text-gray-500 animate-pulse">
          Loading returns...
        </p>
      )}

      {errorMessage && (
        <p className="text-red-500">{errorMessage}</p>
      )}

      {!loading && !errorMessage && returns.length === 0 && (
        <p className="text-gray-500">
          No return requests found.
        </p>
      )}

      {returns.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Reason</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {returns.map((ret) => (
                <tr
                  key={ret._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-sm">
                    {ret.orderId?._id || ret.orderId}
                  </td>

                  <td className="p-4 text-sm">
                    {ret.userId?.name || "Unknown"}
                  </td>

                  <td className="p-4 text-sm max-w-[250px] truncate">
                    {ret.reason}
                  </td>

                  <td className="p-4 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        statusColor[ret.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ret.status}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2 justify-center flex-wrap">
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
                        className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg text-xs capitalize transition"
                      >
                        {st}
                      </button>
                    ))}

                    <Link
                      to={`/return/${ret._id}`}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-xs transition"
                    >
                      View Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Returns;