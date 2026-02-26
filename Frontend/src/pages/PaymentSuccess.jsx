import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearCart } from "../redux/cartRedux";
import { userRequest } from "../requestMethod";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const verifiedRef = useRef(false);
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error("Missing payment session");
        navigate("/cart", { replace: true });
        return;
      }

      if (verifiedRef.current) return;
      verifiedRef.current = true;

      try {
        // Small delay (ensures webhook updates payment)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await userRequest.get(
          `/stripe/verify/${sessionId}`
        );

        if (res.status !== 200 || !res.data) {
          throw new Error("Order not found");
        }

        setOrder(res.data);
        dispatch(clearCart());

        toast.success("Payment confirmed successfully 🎉");

        // Redirect after 6 seconds
        setTimeout(() => {
          navigate("/customer-dashboard/myorders", {
            replace: true,
          });
        }, 6000);

      } catch (err) {
        console.error("Verification error:", err.response || err);
        toast.error("Unable to verify payment");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, dispatch, navigate]);

  /*
  ============================
  LOADING STATE
  ============================
  */

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-pink-600"></div>
        <p className="mt-6 text-lg font-medium text-gray-700">
          Confirming your payment, please wait...
        </p>
      </div>
    );
  }

  /*
  ============================
  ERROR STATE
  ============================
  */

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-red-600">
          Order Verification Failed
        </h2>
        <p className="mt-2 text-gray-600">
          We could not verify your order at this time.
          Please contact customer support if the issue persists.
        </p>
        <button
          className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    );
  }

  /*
  ============================
  SUCCESS STATE
  ============================
  */

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 to-white px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-green-600">
          Order Confirmed
        </h2>

        {/* Professional Message */}
        <p className="mt-4 text-gray-700 leading-relaxed">
          Thank you for your purchase,{" "}
          <span className="font-semibold">{order.name}</span>.
          <br />
          Your order has been successfully placed and is now being processed.
          A confirmation email will be sent to you shortly.
        </p>

        {/* Order Summary Card */}
        <div className="mt-6 bg-gray-50 rounded-xl p-5 text-left shadow-inner">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{order._id}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold text-pink-600">
              KES {order.total}
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Payment Status:</span>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              {order.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Order Status:</span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Redirect Message */}
        <p className="mt-6 text-sm text-gray-500">
          You will be redirected to your orders page shortly.
        </p>

        {/* Button */}
        <button
          className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition duration-200 font-medium"
          onClick={() =>
            navigate("/customer-dashboard/myorders", {
              replace: true,
            })
          }
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;