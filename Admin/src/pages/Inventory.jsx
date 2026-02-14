import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaEdit, FaSave, FaSearch } from "react-icons/fa";
import AddProductModal from "../components/AddProductModal";
import UpdateStockModal from "../components/UpdateStockModal";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [updateStockProduct, setUpdateStockProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all, in, out
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ stock: 0, price: 0 });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get("/products");
      setProducts(res.data.products || res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product callback
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Update stock/price callback (modal)
  const handleUpdateStock = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  // Filter & search
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStock =
      stockFilter === "all"
        ? true
        : stockFilter === "in"
        ? product.stock > 0
        : product.stock === 0;
    return matchesSearch && matchesStock;
  });

  // Inline edit save
  const handleSaveInline = async (id) => {
    try {
      const { stock, price } = editingData;
      if (stock < 0 || price <= 0) {
        toast.error("Invalid stock or price!");
        return;
      }

      const res = await userRequest.put(`/products/${id}`, { stock, price });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
      toast.success("Product updated successfully!");
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex items-center w-full md:w-1/2 border rounded px-3 py-2 bg-white">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full md:w-1/4 border rounded px-3 py-2 bg-white"
          >
            <option value="all">All Products</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-gray-600">Title</th>
                <th className="px-4 py-2 border-b text-gray-600">Stock</th>
                <th className="px-4 py-2 border-b text-gray-600">Price (KES)</th>
                <th className="px-4 py-2 border-b text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border-b">{product.title}</td>

                    <td
                      className={`px-4 py-3 border-b ${
                        product.stock === 0 ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {editingId === product._id ? (
                        <input
                          type="number"
                          value={editingData.stock}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              stock: Number(e.target.value),
                            })
                          }
                          className="border rounded px-2 py-1 w-20"
                          min={0}
                        />
                      ) : (
                        product.stock
                      )}
                    </td>

                    <td className="px-4 py-3 border-b">
                      {editingId === product._id ? (
                        <input
                          type="number"
                          value={editingData.price}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              price: Number(e.target.value),
                            })
                          }
                          className="border rounded px-2 py-1 w-24"
                          min={1}
                        />
                      ) : (
                        product.price
                      )}
                    </td>

                    <td className="px-4 py-3 border-b text-center">
                      {editingId === product._id ? (
                        <button
                          onClick={() => handleSaveInline(product._id)}
                          className="flex items-center justify-center gap-1 px-3 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 transition"
                        >
                          <FaSave /> Save
                        </button>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingId(product._id);
                              setEditingData({
                                stock: product.stock,
                                price: product.price,
                              });
                            }}
                            className="flex items-center justify-center gap-1 px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition"
                          >
                            <FaEdit /> Edit
                          </button>

                          <button
                            onClick={() => setUpdateStockProduct(product)}
                            className="flex items-center justify-center gap-1 px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                          >
                            <FaEdit /> Modal
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}

      {/* Update Stock Modal */}
      {updateStockProduct && (
        <UpdateStockModal
          product={updateStockProduct}
          onClose={() => setUpdateStockProduct(null)}
          onUpdate={handleUpdateStock}
        />
      )}
    </div>
  );
};

export default Inventory;
