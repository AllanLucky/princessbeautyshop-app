import { useState } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const CreateCoupon = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountValue: "",
    discountType: "percentage",
    minOrderAmount: "",
    expiresAt: "",
  });

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation for required fields
    if (!form.code.trim()) {
      toast.error("Coupon Code is required");
      return;
    }
    if (!form.discountValue) {
      toast.error("Discount Value is required");
      return;
    }
    if (!form.expiresAt) {
      toast.error("Expiry Date is required");
      return;
    }

    try {
      setLoading(true);

      await userRequest.post("/coupons", {
        code: form.code.trim(),
        discountValue: Number(form.discountValue),
        discountType: form.discountType,
        minOrderAmount: Number(form.minOrderAmount) || 0,
        expiresAt: form.expiresAt,
      });

      toast.success("Coupon created successfully");
      navigate("/coupons");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-xl mx-auto bg-gray-100 min-h-screen">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3 items-center">
        <h1 className="text-2xl font-bold">Create Coupon</h1>
        <Link to="/coupons">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
            Back
          </button>
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        {/* Coupon Code */}
        <div>
          <label className="block mb-1 font-medium">
            Coupon Code <span className="text-red-500">*</span>
          </label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="SAVE10"
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Discount Value */}
        <div>
          <label className="block mb-1 font-medium">
            Discount Value <span className="text-red-500">*</span>
          </label>
          <input
            name="discountValue"
            type="number"
            value={form.discountValue}
            onChange={handleChange}
            placeholder="10"
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Discount Type */}
        <div>
          <label className="block mb-1 font-medium">Discount Type</label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        {/* Min Order Amount */}
        <div>
          <label className="block mb-1 font-medium">Min Order Amount</label>
          <input
            name="minOrderAmount"
            type="number"
            value={form.minOrderAmount}
            onChange={handleChange}
            placeholder="0"
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block mb-1 font-medium">
            Expiry Date <span className="text-red-500">*</span>
          </label>
          <input
            name="expiresAt"
            type="date"
            value={form.expiresAt}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  );
};

export default CreateCoupon;
