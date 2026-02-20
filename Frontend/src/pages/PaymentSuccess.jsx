import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearCart } from "../redux/cartRedux";
import { userRequest } from "../requestMethod";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    if (!sessionId) {
      toast.error("Missing Stripe session ID.");
      navigate("/cart");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await userRequest.get(`/orders/stripe/${sessionId}`);
        setOrder(res.data);
        dispatch(clearCart());
        toast.success("Order verified successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Could not verify order. Contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) return <p className="text-center mt-20">Verifying payment...</p>;
  if (!order)
    return <p className="text-center mt-20 text-red-600">Order not found.</p>;

  return (
    <div className="text-center mt-20 px-4">
      <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
      <p>Thank you, {order.name}. Your order has been placed.</p>

      <div className="mt-8 max-w-xl mx-auto bg-white shadow rounded-lg p-6 text-left">
        <h3>Order Summary</h3>
        {order.products.map((p) => (
          <div key={p.productId} className="flex justify-between">
            <span>{p.title} × {p.quantity}</span>
            <span>KES {p.price * p.quantity}</span>
          </div>
        ))}
        <div className="border-t mt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>KES {order.total}</span>
        </div>
      </div>

      <button
        className="mt-6 bg-pink-600 text-white px-6 py-3 rounded"
        onClick={() => navigate("/customer-dashboard/my-orders")}
      >
        View Orders
      </button>
    </div>
  );
};

export default PaymentSuccess;