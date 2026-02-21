import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const PaymentDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  /*
  =====================================
  FETCH ORDER DETAIL
  =====================================
  */

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get(`/orders/find/${id}`);

      setOrder(res.data.order || res.data.orders?.[0] || null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  if (loading)
    return <p className="p-6 text-gray-500">Loading payment details...</p>;

  if (!order)
    return (
      <p className="p-6 text-red-500">
        Order not found or failed to load.
      </p>
    );

  /*
  =====================================
  STATUS COLOR
  =====================================
  */

  const statusColor = {
    pending: "text-yellow-500",
    paid: "text-green-600",
    failed: "text-red-500",
    refunded: "text-purple-500",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow rounded-2xl p-6 max-w-3xl mx-auto border">

        <h2 className="text-xl font-bold mb-6">
          Payment Order Detail
        </h2>

        <div className="space-y-2">
          <p className="font-semibold text-lg">{order.name}</p>
          <p className="text-gray-500">{order.email}</p>

          <p className="text-lg font-bold mt-4">
            {order.currency} {order.total}
          </p>

          <p className="mt-2">
            Payment Status:
            <span
              className={`ml-2 font-semibold capitalize ${
                statusColor[order.paymentStatus]
              }`}
            >
              {order.paymentStatus}
            </span>
          </p>

          <p className="text-sm text-gray-600">
            Order Status: {order.orderStatus}
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-3">Products</h3>

          {order.products?.map((item, i) => (
            <p key={i} className="text-sm text-gray-600">
              • {item.title} — {item.quantity} × {item.price}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;