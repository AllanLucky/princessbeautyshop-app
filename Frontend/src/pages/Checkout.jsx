import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const subtotal = cart.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const deliveryFee = cart.products.length > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  const handleProceed = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    navigate("/payment", {
      state: {
        form, // pass all customer info
        cart,
        total,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Customer Details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">
            Confirm Order Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-gray-100 border rounded-lg px-4 py-3 cursor-not-allowed"
                value={form.email}
                disabled
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="07XXXXXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {/* Delivery Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border rounded-lg px-4 py-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Street, City, Landmark"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            {cart.products.map((item) => (
              <div key={item._id} className="flex justify-between">
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
