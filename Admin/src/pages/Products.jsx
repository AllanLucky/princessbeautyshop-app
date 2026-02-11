import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaTrash, FaEye } from "react-icons/fa";
import { userRequest } from "../requestMethods";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await userRequest.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await userRequest.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((item) => item._id !== id));

      toast.success("Product deleted successfully 🗑️");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 120 },

    {
      field: "product",
      headerName: "Product",
      width: 300,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 object-cover rounded-lg border"
            src={params.row.img[0]}
            alt={params.row.title}
          />
          <span className="font-semibold text-gray-800">
            {params.row.title}
          </span>
        </div>
      ),
    },

    { field: "desc", headerName: "Description", width: 200 },

    {
      field: "originalPrice",
      headerName: "Price (KES)",
      width: 120,
      renderCell: (params) => (
        <span className="font-medium text-gray-700">{params.value}</span>
      ),
    },

    {
      field: "inStock",
      headerName: "In Stock",
      width: 120,
      renderCell: (params) => (
        <div className="w-full flex justify-center items-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              params.value
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {params.value ? "Yes" : "No"}
          </span>
        </div>
      ),
    },

    // ===== EDIT =====
    {
      field: "edit",
      headerName: "Edit",
      width: 120,
      renderCell: (params) => (
        <div className="w-full flex justify-center items-center">
          <Link to={`/product/${params.row._id}`}>
            <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-md transition flex items-center justify-center">
              <FaEye className="text-xl" />
            </button>
          </Link>
        </div>
      ),
    },

    // ===== DELETE =====
    {
      field: "delete",
      headerName: "Delete",
      width: 120,
      renderCell: (params) => (
        <div className="w-full flex justify-center items-center">
          <button
            disabled={deletingId === params.row._id}
            onClick={() => handleDelete(params.row._id)}
            className="flex items-center justify-center"
          >
            <div className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition">
              <FaTrash className="text-red-500 hover:text-red-700 text-xl" />
            </div>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 w-[79vw] bg-gray-50 min-h-screen">
      <ToastContainer />

      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
          All Products
        </h1>

        <Link to="/newproduct">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Create Product
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              color: "#374151",
              fontWeight: 600,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fdf2f8",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f3f4f6",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Products;