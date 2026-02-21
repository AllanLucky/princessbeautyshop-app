import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ================= AUTH PROTECTION =================
  if (!user?._id) {
    return <Navigate to="/login" replace />;
  }

  // ================= PREFILL USER DATA =================
  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    }));
  }, [user]);

  // ================= CART TOTALS =================
  const subtotal = useMemo(() => {
    return cart.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
  }, [cart.products]);

  const deliveryFee = cart.products.length > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= PROCEED TO PAYMENT =================
  const handleProceed = () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!cart.products.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const checkoutData = {
      userId: user._id,
      form,
      cart,
      total,
    };

    sessionStorage.setItem(
      "checkoutData",
      JSON.stringify(checkoutData)
    );

    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CUSTOMER DETAILS */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">
            Confirm Order Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <input
              type="text"
              name="name"
              value={form.name}
              readOnly
              className="w-full border bg-gray-100 rounded-lg px-4 py-3"
              placeholder="Full Name"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="w-full border bg-gray-100 rounded-lg px-4 py-3"
              placeholder="Email"
            />

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Phone Number"
            />

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="md:col-span-2 w-full border rounded-lg px-4 py-3 h-28 resize-none"
              placeholder="Street, City, Landmark"
            />

          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            {cart.products.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="flex justify-between"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
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
            onClick={handleProceed}
            className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Proceed to Payment
          </button>
        </div>

      </div>
    </div>
  );
};

export default Checkout;