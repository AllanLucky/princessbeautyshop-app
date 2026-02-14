import { useState } from "react";
import { userRequest } from "../requestMethods";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateVendor = () => {
  const navigate = useNavigate();

  const initialState = {
    name: "",
    email: "",
    phone: "",
    address: "",
    storeName: "",
    password: "",
  };

  const [vendor, setVendor] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setVendor((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= CREATE VENDOR =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, storeName, password } = vendor;

    if (!name || !email || !storeName || !password) {
      return toast.error("Name, Email, Store Name & Password required");
    }

    try {
      setLoading(true);

      await userRequest.post("/vendors", vendor);

      toast.success("Vendor created successfully 🎉");

      // ✅ CLEAR FORM
      setVendor(initialState);

      // ✅ GO BACK AFTER SHORT DELAY
      setTimeout(() => {
        navigate("/vendors");
      }, 800);

    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 w-[77vw] overflow-hidden">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="flex items-center justify-center mb-6">
        <h1 className="text-3xl font-semibold">Create Vendor</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-4">

            <input
              name="name"
              value={vendor.name}
              onChange={handleChange}
              placeholder="Vendor Name"
              className="w-full border rounded px-3 py-2"
            />

            <input
              name="email"
              type="email"
              value={vendor.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
            />

            <input
              name="storeName"
              value={vendor.storeName}
              onChange={handleChange}
              placeholder="Store Name"
              className="w-full border rounded px-3 py-2"
            />

          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            <input
              name="phone"
              value={vendor.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full border rounded px-3 py-2"
            />

            <input
              name="address"
              value={vendor.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border rounded px-3 py-2"
            />

            <input
              type="password"
              name="password"
              value={vendor.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border rounded px-3 py-2"
            />

          </div>

          <div className="col-span-full pt-4">
            <button
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold"
            >
              {loading ? "Creating..." : "Create Vendor"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateVendor;
