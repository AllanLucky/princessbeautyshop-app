import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchCoupon = async () => {
      const res = await userRequest.get("/coupons");
      const coupon = res.data.coupons.find((c) => c._id === id);
      setForm(coupon);
    };

    fetchCoupon();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await userRequest.put(`/coupons/${id}`, form);
      toast.success("Coupon updated");
      navigate("/coupons");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Coupon</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="code" value={form.code || ""} onChange={handleChange} className="w-full border p-2 rounded" />

        <input name="discountValue" value={form.discountValue || ""} type="number" onChange={handleChange} className="w-full border p-2 rounded" />

        <select name="discountType" value={form.discountType} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Update Coupon
        </button>
      </form>
    </div>
  );
};

export default EditCoupon;
