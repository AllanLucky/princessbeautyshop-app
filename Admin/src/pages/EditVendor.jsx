import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null); // initialize as null
  const [loading, setLoading] = useState(false);

  // ================= FETCH VENDOR =================
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await userRequest.get(`/vendors/${id}`);
        setVendor(res.data.vendor); // use res.data.vendor
      } catch (error) {
        toast.error( error.response?.data?.message || "Failed to fetch vendor data");
      }
    };

    fetchVendor();
  }, [id]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setVendor((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await userRequest.put(`/vendors/${id}`, vendor);

      toast.success("Vendor updated successfully");

      setTimeout(() => navigate("/vendors"), 800);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!vendor) return <div className="text-center mt-10">Loading vendor data...</div>;

  return (
    <div className="p-5 w-[77vw]">
      <ToastContainer />
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Vendor</h1>

      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
          <input
            name="name"
            value={vendor.name}
            onChange={handleChange}
            placeholder="Vendor Name"
            className="border p-2 rounded"
          />

          <input
            name="email"
            value={vendor.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
          />

          <input
            name="storeName"
            value={vendor.storeName}
            onChange={handleChange}
            placeholder="Store Name"
            className="border p-2 rounded"
          />

          <input
            name="phone"
            value={vendor.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 rounded"
          />

          <input
            name="address"
            value={vendor.address}
            onChange={handleChange}
            placeholder="Address"
            className="border p-2 rounded"
          />

          <button
            disabled={loading}
            className="col-span-full bg-blue-600 text-white py-3 rounded"
          >
            {loading ? "Updating..." : "Update Vendor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVendor;
