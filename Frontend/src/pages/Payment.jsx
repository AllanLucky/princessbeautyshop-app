import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";
import { userRequest } from "../requestMethod";

const Payment = () => {
  const navigate = useNavigate();

  const currentUser = useSelector(
    (state) => state.user.currentUser
  );

  // ✅ Safe session storage parsing
  let checkoutData = null;

  try {
    checkoutData = JSON.parse(
      sessionStorage.getItem("checkoutData")
    );
  } catch (error) {
    console.error("Checkout data parse error:", error);
  }

  // ✅ Validate checkout data
  if (!checkoutData || !checkoutData.form || !checkoutData.cart) {
    toast.error("Missing order details.");
    navigate("/cart");
    return null;
  }

  const { form, cart, total } = checkoutData;

  // ================= HANDLE PAYMENT =================
  const handlePayment = async () => {
    try {
      const requestBody = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        cart,
        total,
      };

      if (currentUser?._id) {
        requestBody.userId = currentUser._id;
      }

      const response = await userRequest.post(
        "/stripe/create-checkout-session",
        requestBody
      );

      if (response?.data?.url) {
        window.location.assign(response.data.url);
      } else {
        toast.error("Failed to create Stripe session.");
      }

    } catch (err) {
      console.error(err);
      toast.error("Payment failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <ToastContainer />

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">

          <div className="flex items-center gap-2 mb-6">
            <FaLock className="text-green-600" />
            <h2 className="text-2xl font-bold">Secure Payment</h2>
          </div>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between">
              <span className="font-medium">Customer Name</span>
              <span>{form?.name || ""}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Email</span>
              <span>{form?.email || ""}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Phone</span>
              <span>{form?.phone || ""}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Delivery Address</span>
              <span className="text-right max-w-[60%]">
                {form?.address || ""}
              </span>
            </div>

          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">

          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            {cart?.products?.map((item, index) => (
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
              <span>KES {total - 150}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>KES 150</span>
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

        </div>
      </div>
    </div>
  );
};

export default Payment;