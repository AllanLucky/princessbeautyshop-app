import { useState } from "react";
import { toast } from "react-toastify";
import { userRequest } from "../requestMethods";

const UpdateStockModal = ({ product, onClose, onUpdate }) => {
  const [stock, setStock] = useState(product.stock);
  const [price, setPrice] = useState(product.price || 0);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (stock < 0 || price <= 0) {
      toast.error("Stock and Price must be valid numbers");
      return;
    }

    setLoading(true);
    try {
      const res = await userRequest.put(`/products/${product._id}`, { stock, price });
      toast.success("Product updated successfully!");
      onUpdate(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-bold mb-4">Update Product</h2>

        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          min={0}
          className="border rounded px-3 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="Stock"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min={1}
          className="border rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="Price (KES)"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white font-medium transition"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStockModal;
