import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";
import { FaTruck, FaCheckCircle, FaClock, FaBoxOpen } from "react-icons/fa";

const STATUS_MAP = {
  0: { text: "Pending", icon: FaClock, color: "bg-yellow-100 text-yellow-800" },
  1: { text: "Confirmed", icon: FaCheckCircle, color: "bg-blue-100 text-blue-800" },
  2: { text: "Processing", icon: FaTruck, color: "bg-blue-100 text-blue-800" },
  3: { text: "Shipped", icon: FaTruck, color: "bg-purple-100 text-purple-800" },
  4: { text: "Delivered", icon: FaCheckCircle, color: "bg-green-100 text-green-800" },
  5: { text: "Cancelled", icon: FaBoxOpen, color: "bg-red-100 text-red-800" },
};

export default function OrderDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [status, setStatus] = useState(0);
  const [note, setNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  /*
  =====================================================
  FETCH ORDER
  =====================================================
  */

  const fetchOrder = async () => {
    try {

      setLoading(true);

      const res = await userRequest.get(`/orders/find/${id}`);

      const data = res?.data?.order || {};

      setOrder(data);
      setStatus(Number(data.status ?? 0));
      setTrackingNumber(data.trackingNumber || "");

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to load order"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  /*
  =====================================================
  UPDATE ORDER FLOW
  =====================================================
  */

  const updateOrder = async () => {

    if (!order) return;

    try {

      setUpdating(true);

      /*
      Shipping Guard Rule
      */

      if (order.status === 3 && status !== 4) {
        toast.info("Shipped order can only be marked as Delivered");
        return;
      }

      const res = await userRequest.put(`/orders/${id}`, {
        status,
        note,
        trackingNumber,
      });

      if (res?.data?.success) {
        toast.success("Order updated successfully");
        await fetchOrder();
      } else {
        toast.error("Update failed");
      }

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Update failed"
      );

    } finally {
      setUpdating(false);
    }
  };

  /*
  =====================================================
  LOADING STATES
  =====================================================
  */

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-red-500">
        Order not found
      </div>
    );
  }

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP[0];
  const StatusIcon = statusInfo.icon;

  /*
  =====================================================
  DROPDOWN RULE (IMPORTANT)
  =====================================================
  */

  const filteredStatusOptions = Object.entries(STATUS_MAP).filter(
    ([key]) => {
      if (order.status === 3) return Number(key) === 4;
      return Number(key) >= order.status;
    }
  );

  /*
  =====================================================
  RENDER
  =====================================================
  */

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">

      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow p-6 space-y-6">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">Order Detail</h1>
            <p className="text-gray-500">
              #{order._id ? order._id.slice(-8) : "N/A"}
            </p>
          </div>

          <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${statusInfo.color}`}>
            <StatusIcon size={16} />
            {statusInfo.text}
          </div>

        </div>

        {/* PROGRESS */}

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{order.progress || 0}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${order.progress || 0}%` }}
            />
          </div>
        </div>

        {/* CUSTOMER */}

        <div className="grid md:grid-cols-2 gap-6 text-sm">

          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="font-semibold mb-2">Customer</h2>
            <p>Name: {order.name || "-"}</p>
            <p>Email: {order.email || "-"}</p>
            <p>Phone: {order.phone || "-"}</p>
            <p>Address: {order.address || "-"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="font-semibold mb-2">Shipping</h2>
            <p>Tracking #: {order.trackingNumber || "-"}</p>
            <p>
              Estimated Delivery:
              {order.estimatedDeliveryDate
                ? new Date(order.estimatedDeliveryDate).toLocaleDateString()
                : " N/A"}
            </p>
            <p>Payment Status: {order.paymentStatus || "-"}</p>
          </div>

        </div>

        {/* PRODUCTS */}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Products</h2>

          {(order.products || []).map((product, i) => (
            <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">

              <img
                src={product?.img || "https://via.placeholder.com/80"}
                alt="product"
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <p className="font-semibold">{product?.title || "Product"}</p>
                <p className="text-sm text-gray-500">
                  Qty: {product?.quantity || 0}
                </p>
                <p className="text-sm text-gray-500">
                  KES {product?.price || 0}
                </p>
              </div>

            </div>
          ))}

        </div>

        {/* ADMIN UPDATE */}

        <div className="space-y-4 bg-gray-50 p-5 rounded-xl">

          <h2 className="font-semibold">Admin Update</h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">

            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="border p-2 rounded"
            >
              {filteredStatusOptions.map(([key, value]) => (
                <option key={key} value={Number(key)}>
                  {value.text}
                </option>
              ))}
            </select>

            <input
              placeholder="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              placeholder="Admin Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border p-2 rounded"
            />

          </div>

          <button
            onClick={updateOrder}
            disabled={updating}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            {updating ? "Updating..." : "Update Order"}
          </button>

        </div>
      </div>
    </div>
  );
}