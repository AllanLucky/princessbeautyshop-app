import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";
import { FaCheckDouble, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const Payment = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  =====================================
  FETCH ORDERS
  =====================================
  */

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get("/orders");

      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================
  MARK PAYMENT PAID
  =====================================
  */

  const markPaid = async (id) => {
    try {
      await userRequest.put(`/orders/${id}`, {
        paymentStatus: "paid",
        isPaid: true,
        paidAt: new Date(),
      });

      toast.success("Payment marked as paid");
      fetchOrders();
    } catch {
      toast.error("Update failed");
    }
  };

  /*
  =====================================
  DELETE ORDER
  =====================================
  */

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await userRequest.delete(`/orders/${id}`);

      setOrders((prev) => prev.filter((o) => o._id !== id));

      toast.success("Order deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <p className="p-6 text-gray-500">Loading payments...</p>;

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 p-3">Payment Dashboard</h1>

      <div className="bg-white shadow rounded overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Products</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-pink-50 transition"
              >
                {/* CUSTOMER */}
                <td className="p-4">
                  <p className="font-semibold">{order.name}</p>
                  <p className="text-xs text-gray-500">{order.email}</p>
                </td>

                {/* AMOUNT */}
                <td className="p-4 font-semibold">
                  {order.currency} {order.total}
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs capitalize ${
                      statusColor[order.paymentStatus]
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                {/* PRODUCTS */}
                <td className="p-4 max-w-xs">
                  {order.products?.map((item, i) => (
                    <p key={i} className="text-xs text-gray-600">
                      • {item.title} ({item.quantity})
                    </p>
                  ))}
                </td>

                {/* ACTIONS */}
                <td className="p-4 flex justify-center gap-3">
                  {order.paymentStatus !== "paid" && (
                    <button
                      onClick={() => markPaid(order._id)}
                      className="text-green-600 hover:text-green-800"
                      title="Mark Paid"
                    >
                      <FaCheckDouble size={18} />
                    </button>
                  )}

                  <Link
                    to={`/payment/${order._id}`}
                    className="text-pink-600 hover:text-pink-800"
                  >
                    <FaEye size={18} />
                  </Link>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;