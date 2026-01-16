import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";
import { userRequest } from "../requestMethod";

const Payment = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  if (!user || !cart.products.length) {
    toast.error("Your cart is empty or you are not logged in.");
    navigate("/cart");
    return null;
  }

  const handlePayment = async () => {
    try {
      // Send request to backend to create Stripe checkout session
      const res = await userRequest.post("/stripe/create-checkout-session", {
        userId: user._id,
        name: user.name,
        email: user.email,
        cart,
      });

      if (res?.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to create Stripe session.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Please try again.");
    }
  };

  const subtotal = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: PAYMENT INFO */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaLock className="text-green-600" />
            <h2 className="text-2xl font-bold">Secure Payment</h2>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Your payment is encrypted and processed securely.
              We do not store your card or mobile money details.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Customer Name</span>
              <span>{user.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Email</span>
              <span>{user.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Phone</span>
              <span>{user.phone || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Delivery Address</span>
              <span className="text-right max-w-[60%]">{cart.address || "-"}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            {cart.products.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>{item.title} × {item.quantity}</span>
                <span>KES {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>KES {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>KES {deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>KES {total}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Pay KES {total}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By clicking “Pay”, you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;

