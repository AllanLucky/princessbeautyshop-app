import { useEffect, useState, useRef } from "react";
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

  const verifiedRef = useRef(false);

  const sessionId = new URLSearchParams(location.search).get(
    "session_id"
  );

  useEffect(() => {
    if (!sessionId) {
      toast.error("Missing Stripe session ID.");
      navigate("/cart", { replace: true });
      return;
    }

    // Prevent double execution in React Strict Mode
    if (verifiedRef.current) return;
    verifiedRef.current = true;

    const verifyOrder = async () => {
      try {
        const res = await userRequest.get(
          `/orders/stripe/${sessionId}`
        );

        if (!res?.data) {
          throw new Error("Order not found");
        }

        setOrder(res.data);

        // Clear cart AFTER payment verification
        dispatch(clearCart());

        toast.success("Payment successful 🎉");

        // Auto redirect (professional UX)
        setTimeout(() => {
          navigate("/customer-dashboard/myorders", {
            replace: true,
          });
        }, 3000);
      } catch (err) {
        console.error(err);
        toast.error("Payment verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyOrder();
  }, [sessionId, dispatch, navigate]);

  if (loading) {
    return (
      <p className="text-center mt-20">
        Verifying payment...
      </p>
    );
  }

  if (!order) {
    return (
      <p className="text-center mt-20 text-red-600">
        Order not found.
      </p>
    );
  }

  return (
    <div className="text-center mt-20 px-4">
      <h2 className="text-3xl font-bold text-green-600">
        Payment Successful!
      </h2>

      <p className="mt-2">
        Thank you, {order.name}. Your order has been placed.
      </p>

      <div className="mt-8 max-w-xl mx-auto bg-white shadow rounded-lg p-6 text-left">
        <h3 className="font-semibold mb-4">Order Summary</h3>

        {order.products?.map((p, i) => (
          <div
            key={p.productId || i}
            className="flex justify-between text-sm mb-2"
          >
            <span>
              {p.title} × {p.quantity}
            </span>
            <span>KES {p.price * p.quantity}</span>
          </div>
        ))}

        <div className="border-t mt-4 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>KES {order.total}</span>
        </div>
      </div>

      <button
        className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded transition"
        onClick={() =>
          navigate("/customer-dashboard/myorders", {
            replace: true,
          })
        }
      >
        View Orders
      </button>
    </div>
  );
};

export default PaymentSuccess;