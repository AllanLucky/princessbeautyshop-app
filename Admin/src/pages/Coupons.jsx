// Coupons.jsx
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Coupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  // ================= FETCH COUPONS =================
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/coupons");
        setCoupons(res.data.coupons || []);
      } catch (err) {
        console.error("Error fetching coupons:", err);
        toast.error(err.response?.data?.message || "Failed to fetch coupons");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  // ================= DELETE COUPON =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      setDeletingId(id);
      await userRequest.delete(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      toast.success("Coupon deleted successfully 🗑️");
    } catch (err) {
      console.error("Error deleting coupon:", err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId("");
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "code", headerName: "Code", width: 130, flex: 1 },
    {
      field: "discountValue",
      headerName: "Discount",
      width: 140,
      renderCell: (params) =>
        params.row.discountType === "percentage"
          ? `${params.value}%`
          : `KES ${params.value.toLocaleString()}`,
    },
    { field: "discountType", headerName: "Type", width: 110 },
    { field: "minOrderAmount", headerName: "Min Order", width: 120,
      renderCell: (params) =>
        params.value ? `KES ${params.value.toLocaleString()}` : "None",
    },
    { field: "usedCount", headerName: "Used", width: 80 },
    {
      field: "expiresAt",
      headerName: "Expires",
      width: 150,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "N/A",
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            params.value
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {params.value ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      width: 160,
      renderCell: (params) => (
        <div className="flex gap-4 items-center">
          <FaEdit
            onClick={() => navigate(`/coupon/${params.row._id}`)}
            className="text-blue-500 cursor-pointer text-lg"
          />

          <button
            disabled={deletingId === params.row._id}
            onClick={() => handleDelete(params.row._id)}
            className="focus:outline-none"
          >
            {deletingId === params.row._id ? (
              <span className="text-sm text-gray-400">Deleting...</span>
            ) : (
              <FaTrash className="text-red-500 cursor-pointer text-lg" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={() => navigate("/new-coupon")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          + Create Coupon
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4">
        <DataGrid
          rows={coupons}
          getRowId={(row) => row._id}
          columns={columns}
          loading={loading}
          autoHeight
          rowHeight={70}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
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

export default Coupons;