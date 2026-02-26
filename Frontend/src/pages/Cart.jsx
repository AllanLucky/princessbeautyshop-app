import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct, updateQuantity, clearCart } from "../redux/cartRedux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart || {});
  const user = useSelector((state) => state.user?.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = Array.isArray(cart?.products) ? cart.products : [];

  // ================= REMOVE PRODUCT =================
  const handleRemoveProduct = (product) => {
    if (!product) return;

    dispatch(removeProduct(product));
    toast.info(`${product.title} removed`);
  };

  // ================= QUANTITY CONTROL =================
  const handleDecrease = (product) => {
    if (!product || product.quantity <= 1) return;

    dispatch(
      updateQuantity({
        _id: product._id,
        quantity: product.quantity - 1,
      })
    );
  };

  const handleIncrease = (product) => {
    if (!product) return;

    const stock = product.stock ?? product.countInStock ?? Infinity;

    if (product.quantity >= stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    dispatch(
      updateQuantity({
        _id: product._id,
        quantity: product.quantity + 1,
      })
    );
  };

  // ================= CLEAR CART =================
  const handleClearCart = () => {
    if (!products.length) return;

    if (!window.confirm("Clear entire cart?")) return;

    dispatch(clearCart());
    toast.error("Cart cleared");
  };

  // ================= PRICE CALCULATION =================
  const subtotal = products.reduce(
    (acc, item) =>
      acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const deliveryFee = products.length ? 150 : 0;
  const total = subtotal + deliveryFee;

  const formatCurrency = (num) =>
    `KES ${Number(num || 0).toLocaleString()}`;

  // ================= CHECKOUT NAVIGATION =================
  const handleProceedCheckout = () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!products.length) {
      toast.warning("Cart is empty");
      return;
    }

    // Stock validation
    for (const item of products) {
      const stock = item.stock ?? item.countInStock ?? Infinity;

      if (Number(item.quantity) > Number(stock)) {
        toast.error(`${item.title} exceeds available stock`);
        return;
      }
    }

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen px-4 lg:px-20 py-10 bg-gray-50">
      <ToastContainer position="top-right" autoClose={2500} />

      <h2 className="text-3xl font-bold mb-10 text-gray-800">
        🛒 Shopping Cart
      </h2>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT SECTION */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-6 border-b pb-3">
            Your Items ({products.length})
          </h3>

          {products.length ? (
            products.map((item) => {
              const stock = item.stock ?? item.countInStock ?? Infinity;

              return (
                <div
                  key={item._id}
                  className="flex gap-6 border-b pb-6 mb-6 items-center"
                >
                  <img
                    src={
                      Array.isArray(item.img)
                        ? item.img[0]
                        : item.img || "/no-image.png"
                    }
                    alt={item.title}
                    className="w-28 h-28 object-cover rounded-lg border"
                  />

                  <div className="flex-1">
                    <h4 className="font-semibold">{item.title}</h4>

                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.desc}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Stock: {stock}
                    </p>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() => handleDecrease(item)}
                        className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full"
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleIncrease(item)}
                        disabled={item.quantity >= stock}
                        className={`p-2 rounded-full text-white ${
                          item.quantity >= stock
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600"
                        }`}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <span className="font-bold text-pink-600 text-lg">
                      {formatCurrency(item.price * item.quantity)}
                    </span>

                    <FaTrashAlt
                      onClick={() => handleRemoveProduct(item)}
                      className="text-red-500 cursor-pointer hover:scale-110"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500">
              🛒 Your cart is empty
            </div>
          )}

          {products.length > 0 && (
            <button
              onClick={handleClearCart}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg mt-4"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* RIGHT SUMMARY */}
        <div className="w-full lg:w-[360px] bg-white shadow-md rounded-xl p-6 h-fit">
          <h3 className="font-semibold text-lg mb-6 border-b pb-3">
            Order Summary
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span className="text-pink-600">
                {formatCurrency(total)}
              </span>
            </div>

            <button
              onClick={handleProceedCheckout}
              disabled={!products.length}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                products.length
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;