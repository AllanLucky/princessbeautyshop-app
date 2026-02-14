import { useState } from "react";
import { toast } from "react-toastify";
import { userRequest } from "../requestMethods";

const AddProductModal = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim() || stock < 0 || price <= 0) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setLoading(true);
    try {
      const res = await userRequest.post("/products", { title: title.trim(), stock, price });
      toast.success("Product added successfully!");
      onAdd(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            min={0}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <input
            type="number"
            placeholder="Price (KES)"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={1}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white font-medium transition"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
