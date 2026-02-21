import { useEffect, useState, useCallback } from "react";
import { userRequest } from "../requestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const CreateReturn = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  /*
  ====================================
  FETCH USER ORDERS
  ====================================
  */

  const fetchOrders = useCallback(async () => {
    try {
      setFetchingOrders(true);

      const res = await userRequest.get("/orders");

      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setFetchingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /*
  ====================================
  SUBMIT RETURN REQUEST
  ====================================
  */

  const submitReturn = async () => {
    if (!selectedOrder || !selectedProduct || !reason) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await userRequest.post("/returns", {
        orderId: selectedOrder,
        productId: selectedProduct,
        reason,
      });

      toast.success("Return request submitted");

      setSelectedOrder("");
      setSelectedProduct("");
      setReason("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Return request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ====================================
  GET PRODUCTS FROM SELECTED ORDER
  ====================================
  */

  const selectedOrderProducts =
    orders.find((o) => o._id === selectedOrder)?.products || [];

  return (
    <div className="p-5 w-[77vw] bg-white shadow-lg rounded-lg">

      <ToastContainer />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">
          Create Return Request
        </h1>

        <Link to="/returns">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
            Back
          </button>
        </Link>
      </div>

      {/* LOADING ORDERS */}
      {fetchingOrders && (
        <p className="text-gray-500 mb-3">Loading orders...</p>
      )}

      {/* ORDER SELECT */}
      <select
        value={selectedOrder}
        onChange={(e) => {
          setSelectedOrder(e.target.value);
          setSelectedProduct("");
        }}
        className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <option value="">Select Order</option>

        {orders.map((order) => (
          <option key={order._id} value={order._id}>
            Order #{order._id.slice(-6)} — {order.total}
          </option>
        ))}
      </select>

      {/* PRODUCT SELECT */}
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <option value="">Select Product</option>

        {selectedOrderProducts.map((p, index) => (
          <option
            key={`${p.productId}-${index}`}
            value={p.productId}
          >
            {p.title} — Qty {p.quantity}
          </option>
        ))}
      </select>

      {/* REASON */}
      <textarea
        placeholder="Return reason..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full border p-3 rounded mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      <button
        onClick={submitReturn}
        disabled={loading}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl transition font-medium disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Return Request"}
      </button>

    </div>
  );
};

export default CreateReturn;