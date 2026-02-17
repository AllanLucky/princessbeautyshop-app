import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaTrash, FaEye, FaLayerGroup, FaStar } from "react-icons/fa";
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
        const res = await userRequest.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setDeletingId(id);

      await userRequest.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((p) => p._id !== id));

      toast.success("Product deleted successfully 🗑️");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { field: "_id", headerName: "ID", width: 100 },

    {
      field: "product",
      headerName: "Product",
      width: 300,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <img
            src={params.row.img?.[0]}
            className="h-12 w-12 rounded-lg object-cover border"
          />
          <span className="font-semibold">{params.row.title}</span>
        </div>
      ),
    },

    {
      field: "originalPrice",
      headerName: "Price",
      width: 120,
      renderCell: (p) => <b>KES {p.row.originalPrice}</b>,
    },

    {
      field: "stock",
      headerName: "Stock",
      width: 100,
    },

    {
      field: "inStock",
      headerName: "Status",
      width: 120,
      renderCell: (p) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            p.row.inStock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {p.row.inStock ? "In Stock" : "Out"}
        </span>
      ),
    },

    {
      field: "view",
      headerName: "View",
      width: 90,
      renderCell: (params) => (
        <Link to={`/product/${params.row._id}`}>
          <FaEye className="text-purple-600 text-lg cursor-pointer" />
        </Link>
      ),
    },

    {
      field: "features",
      headerName: "Sections",
      width: 110,
      renderCell: (params) => (
        <Link to={`/admin/product/features/${params.row._id}`}>
          <div className="bg-indigo-50 p-2 rounded-full hover:bg-indigo-100">
            <FaLayerGroup className="text-purple-600 text-lg" />
          </div>
        </Link>
      ),
    },

    {
      field: "reviews",
      headerName: "Reviews",
      width: 110,
      renderCell: (params) => (
        <Link to={`/reviews/${params.row._id}`}>
          <div className="bg-yellow-50 p-2 rounded-full hover:bg-yellow-100">
            <FaStar className="text-yellow-500 text-lg" />
          </div>
        </Link>
      ),
    },

    {
      field: "delete",
      headerName: "Delete",
      width: 110,
      renderCell: (params) => (
        <button
          disabled={deletingId === params.row._id}
          onClick={() => handleDelete(params.row._id)}
        >
          <div className="bg-red-50 hover:bg-red-100 p-2 rounded-full">
            <FaTrash className="text-red-600 text-lg" />
          </div>
        </button>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-100 w-[77vw] overflow-hidden">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Link to="/newproduct">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
            + Create Product
          </button>
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4 w-full overflow-hidden">
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { outline: "none" },
          }}
        />
      </div>
    </div>
  );
};

export default Products;
