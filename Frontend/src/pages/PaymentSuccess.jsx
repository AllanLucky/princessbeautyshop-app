import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartRedux";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const createOrder = async () => {
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
    };

    createOrder();
  }, []);

  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h2>
      <button
        className="mt-6 bg-pink-600 text-white px-6 py-3 rounded"
        onClick={() => navigate("/orders")}
      >
        View Orders
      </button>
    </div>
  );
};

export default PaymentSuccess;

