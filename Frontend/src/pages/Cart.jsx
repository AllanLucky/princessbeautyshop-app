import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct, updateQuantity, clearCart } from "../redux/cartRedux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🗑 Remove product
  const handleRemoveProduct = (product) => {
    dispatch(removeProduct(product));
    toast.info(`${product.title} removed from cart`, { position: "top-right", autoClose: 3000 });
  };

  // ➖ Decrease quantity
  const handleDecrease = (product) => {
    if (product.quantity > 1) {
      dispatch(updateQuantity({ _id: product._id, quantity: product.quantity - 1 }));
      toast.info(`Decreased quantity of ${product.title}`, { position: "top-right", autoClose: 3000 });
    }
  };

  // ➕ Increase quantity
  const handleIncrease = (product) => {
    dispatch(updateQuantity({ _id: product._id, quantity: product.quantity + 1 }));
    toast.success(`Increased quantity of ${product.title}`, { position: "top-right", autoClose: 3000 });
  };

  // 🧹 Clear cart
  const handleClearCart = () => {
    dispatch(clearCart());
    toast.error("Cart cleared", { position: "top-right", autoClose: 3000 });
  };

  // 💰 Calculate totals
  const subtotal = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = cart.products.length > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  // 💳 Checkout
  const handlePaymentCheckout = async () => {
    if (!user.currentUser) {
      toast.error("You need to login to proceed with checkout", { position: "top-right", autoClose: 3000 });
      navigate("/login");
      return;
    }
    try {
      const res = await userRequest.post("/stripe/create-checkout-session", {
        cart,
        userId: user.currentUser._id,
        email: user.currentUser.email,
        name: user.currentUser.name,
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 py-10 bg-gray-50">
      <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center lg:text-left">
        Shopping Cart
      </h2>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-6 border-b pb-2">Your Items</h3>

          {/* Items */}
          {cart.products.length > 0 ? (
            cart.products.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row gap-5 border-b pb-6">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg mx-auto sm:mx-0"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>

                  {/* Qty */}
                  <div className="flex justify-center sm:justify-start items-center gap-4 mt-5">
                    <FaMinus
                      className="bg-pink-300 p-2 text-white rounded-full cursor-pointer"
                      onClick={() => handleDecrease(item)}
                    />
                    <span className="font-semibold text-lg">{item.quantity}</span>
                    <FaPlus
                      className="bg-pink-300 p-2 text-white rounded-full cursor-pointer"
                      onClick={() => handleIncrease(item)}
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="text-center sm:text-right flex flex-col justify-between">
                  <span className="text-xl font-bold text-pink-600 mt-4 sm:mt-0">
                    KES {item.price * item.quantity}
                  </span>
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer text-xl mx-auto sm:mx-0"
                    onClick={() => handleRemoveProduct(item)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          )}

          {cart.products.length > 0 && (
            <button
              className="bg-red-400 w-full sm:w-[200px] text-white font-semibold p-4 mt-4 rounded-md mx-auto sm:mx-0"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* RIGHT */}
        {cart.products.length > 0 ? (
          <div className="w-full lg:w-[350px] h-[350px] bg-white shadow-md rounded-xl p-6 mx-auto lg:mx-0">
            <h3 className="font-semibold mb-6 border-b pb-2">Order Summary</h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>KES {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>KES {deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-4">
                <span>Total</span>
                <span>KES {total}</span>
              </div>
            </div>
            <button
              className="bg-pink-600 w-full mt-6 py-3 rounded-lg text-white font-semibold hover:bg-pink-700"
              onClick={handlePaymentCheckout}
            >
              Proceed Checkout
            </button>
          </div>
        ) : (
          <div className="w-full lg:w-[350px] bg-white shadow-md rounded-xl p-6 mx-auto lg:mx-0 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty. Start shopping now!</p>
            <button
              className="bg-pink-600 w-full py-3 rounded-lg text-white font-semibold hover:bg-pink-700"
              onClick={() => navigate("/products/all")}
            >
              Go to Products
            </button>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Cart;
