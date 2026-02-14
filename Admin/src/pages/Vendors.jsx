import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userRequest } from "../requestMethods"; // Axios instance
import { FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState({ name: "", email: "" });

  // Fetch all vendors
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await userRequest.get("/vendors");
      setVendors(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle add or update vendor
  const handleSave = async () => {
    if (!currentVendor.name || !currentVendor.email) {
      toast.error("Name and Email are required!");
      return;
    }

    try {
      if (currentVendor._id) {
        // Update existing vendor
        await userRequest.put(`/vendors/${currentVendor._id}`, currentVendor);
        toast.success("Vendor updated successfully!");
      } else {
        // Add new vendor
        await userRequest.post("/vendors", currentVendor);
        toast.success("Vendor added successfully!");
      }
      setModalOpen(false);
      setCurrentVendor({ name: "", email: "" });
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save vendor");
    }
  };

  // Handle delete vendor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await userRequest.delete(`/vendors/${id}`);
      toast.success("Vendor deleted successfully!");
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete vendor");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vendors</h1>
          <button
            onClick={() => {
              setModalOpen(true);
              setCurrentVendor({ name: "", email: "" });
            }}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium"
          >
            <FaPlusCircle /> Add Vendor
          </button>
        </div>

        {/* Vendors Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr key={vendor._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{vendor.name}</td>
                  <td className="px-4 py-2 border-b">{vendor.email}</td>
                  <td className="px-4 py-2 border-b flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentVendor(vendor);
                        setModalOpen(true);
                      }}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vendor._id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {vendors.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No vendors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {currentVendor._id ? "Edit Vendor" : "Add Vendor"}
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={currentVendor.name}
                  onChange={(e) =>
                    setCurrentVendor({ ...currentVendor, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={currentVendor.email}
                  onChange={(e) =>
                    setCurrentVendor({ ...currentVendor, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
