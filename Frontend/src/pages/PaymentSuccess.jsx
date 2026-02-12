import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartRedux";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!state || !state.form || !state.cart) {
      toast.error("Missing payment information.");
      navigate("/cart");
      return;
    }

    const createOrder = async () => {
      try {
        await userRequest.post("/orders", {
          name: state.form.name,
          email: state.form.email,
          phone: state.form.phone,
          address: state.form.address,
          products: state.cart.products,
          total: state.total,
          paymentStatus: "paid",
          paymentRef: state.paymentRef,
        });

        dispatch(clearCart());
        toast.success("Order created successfully!");
      } catch (err) {
        console.error("Failed to create order:", err);
        toast.error("Failed to save your order. Please contact support.");
      }
    };

    createOrder();
  }, [state, navigate, dispatch]);

  if (!state || !state.form || !state.cart) return null;

  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h2>
      <p className="mt-4 text-gray-700">
        Thank you, {state.form.name}. Your order has been placed successfully.
      </p>
      <button
        className="mt-6 bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700 transition"
        onClick={() => navigate("/myorders")}
      >
        View Orders
      </button>
    </div>
  );
};

export default PaymentSuccess;
