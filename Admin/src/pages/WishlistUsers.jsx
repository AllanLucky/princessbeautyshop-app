// MyWishlist.jsx
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaTrash, FaEye } from "react-icons/fa";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  // ================= FETCH WISHLIST =================
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get("/products/my-wishlist");
      setWishlist(res.data?.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ================= REMOVE FROM WISHLIST =================
  const handleRemove = async (productId) => {
    if (!window.confirm("Remove this product from your wishlist?")) return;

    try {
      setRemovingId(productId);
      await userRequest.post(`/products/wishlist/${productId}`); // toggle remove
      toast.success("Removed from wishlist");
      fetchWishlist(); // refresh list
    } catch (err) {
      console.error("Error removing wishlist item:", err);
      toast.error(err?.response?.data?.message || "Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { field: "_id", headerName: "ID", width: 120 },

    {
      field: "customer",
      headerName: "Customer",
      width: 180,
      valueGetter: (params) => params.row.user?.name || "You",
    },

    {
      field: "product",
      headerName: "Product",
      width: 300,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <img
            src={params.row.img?.[0]}
            alt={params.row.title}
            className="h-12 w-12 rounded-lg object-cover border"
          />
          <span className="font-semibold">{params.row.title}</span>
        </div>
      ),
    },

    {
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: (params) => (
        <span className="font-bold">
          KES {params.row.discountedPrice || params.row.originalPrice}
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
      field: "remove",
      headerName: "Remove",
      width: 110,
      renderCell: (params) => (
        <button
          disabled={removingId === params.row._id}
          onClick={() => handleRemove(params.row._id)}
          className="focus:outline-none"
        >
          <div
            className={`p-2 rounded-full ${
              removingId === params.row._id
                ? "bg-gray-200 text-gray-500"
                : "bg-red-50 hover:bg-red-100"
            }`}
          >
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
        <h1 className="text-2xl font-bold">My Wishlist</h1>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4 w-full overflow-hidden">
        <DataGrid
          rows={wishlist}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { outline: "none" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f3f4f6",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row:hover": { backgroundColor: "#f9fafb" },
          }}
        />
      </div>
    </div>
  );
};

export default MyWishlist;
