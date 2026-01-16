import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct, updateQuantity, clearCart } from "../redux/cartRedux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🗑 Remove product
  const handleRemoveProduct = (product) => {
    dispatch(removeProduct(product));
    toast.info(`${product.title} removed from cart`);
  };

  // ➖ Decrease quantity
  const handleDecrease = (product) => {
    if (product.quantity > 1) {
      dispatch(updateQuantity({ _id: product._id, quantity: product.quantity - 1 }));
    }
  };

  // ➕ Increase quantity
  const handleIncrease = (product) => {
    dispatch(updateQuantity({ _id: product._id, quantity: product.quantity + 1 }));
  };

  // 🧹 Clear cart
  const handleClearCart = () => {
    dispatch(clearCart());
    toast.error("Cart cleared");
  };

  // 💰 Totals
  const subtotal = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = cart.products.length ? 150 : 0;
  const total = subtotal + deliveryFee;

  // ✅ Proceed to Checkout (NO ORDER CREATED HERE)
  const handleProceedCheckout = () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (!cart.products.length) {
      toast.warning("Your cart is empty");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen px-4 lg:px-20 py-10 bg-gray-50">
      <h2 className="text-3xl font-bold mb-10">Shopping Cart</h2>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT */}
        <div className="flex-1 bg-white shadow rounded-xl p-6">
          <h3 className="font-semibold mb-6 border-b pb-2">Your Items</h3>

          {cart.products.length ? (
            cart.products.map((item) => (
              <div key={item._id} className="flex gap-6 border-b pb-6 mb-6">
                <img
                  src={Array.isArray(item.img) ? item.img[0] : item.img}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded"
                />

                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>

                  <div className="flex items-center gap-4 mt-4">
                    <FaMinus
                      onClick={() => handleDecrease(item)}
                      className="cursor-pointer bg-pink-300 p-2 rounded-full text-white"
                    />
                    <span>{item.quantity}</span>
                    <FaPlus
                      onClick={() => handleIncrease(item)}
                      className="cursor-pointer bg-pink-300 p-2 rounded-full text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between text-right">
                  <span className="font-bold text-pink-600">
                    KES {item.price * item.quantity}
                  </span>
                  <FaTrashAlt
                    onClick={() => handleRemoveProduct(item)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          )}

          {cart.products.length > 0 && (
            <button
              onClick={handleClearCart}
              className="bg-red-400 text-white px-6 py-3 rounded mt-4"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[350px] bg-white shadow rounded-xl p-6">
          <h3 className="font-semibold mb-6 border-b pb-2">Order Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>KES {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>KES {deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-4">
              <span>Total</span>
              <span>KES {total}</span>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="bg-pink-600 w-full py-3 rounded text-white font-semibold hover:bg-pink-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Cart;

