import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCheckDouble,
  FaClock,
  FaRegCheckCircle,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderDetailModal from "./OrderInvoiceModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ================= FETCH ORDERS =================
  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const response = await userRequest.get("/orders");
        const fetchedOrders = response.data.orders || response.data;
        setOrders(fetchedOrders);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  // ================= MARK DELIVERED =================
  const handleUpdateOrder = async (id) => {
    try {
      await userRequest.put(`/orders/${id}`, { status: 2 });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: 2 } : order
        )
      );

      toast.success("Order marked as delivered");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update order");
    }
  };

  // ================= DELETE ORDER =================
  const handleDeleteOrder = async (id) => {
    try {
      setDeletingId(id);

      await userRequest.delete(`/orders/${id}`);

      setOrders((prev) => prev.filter((order) => order._id !== id));

      toast.success("Order deleted successfully 🗑️");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const openOrderDetails = (order) => setSelectedOrder(order);
  const closeOrderDetails = () => setSelectedOrder(null);

  // ================= TABLE COLUMNS =================
  const columns = [
    { field: "_id", headerName: "Order ID", width: 200 },
    { field: "name", headerName: "Customer Name", width: 200 },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <div className="w-full flex justify-center items-center">
          {params.value === 0 && <FaClock className="text-yellow-500 text-xl" />}
          {params.value === 1 && <FaCheckDouble className="text-blue-500 text-xl" />}
          {params.value === 2 && <FaCheckDouble className="text-green-500 text-xl" />}
        </div>
      ),
    },

    {
      field: "deliver",
      headerName: "Mark Delivered",
      width: 150,
      renderCell: (params) => (
        <div className="w-full flex justify-center items-center">
          {params.row.status !== 2 ? (
            <FaRegCheckCircle
              className="text-[25px] cursor-pointer text-pink-500 hover:text-pink-600 transition"
              onClick={() => handleUpdateOrder(params.row._id)}
            />
          ) : (
            <span className="text-gray-400 font-medium">Completed</span>
          )}
        </div>
      ),
    },

    {
      field: "details",
      headerName: "View",
      width: 120,
      renderCell: (params) => (
        <div className="w-full flex justify-center items-center">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-md transition flex items-center justify-center"
            onClick={() => openOrderDetails(params.row)}
          >
            <FaEye className="text-xl" />
          </button>
        </div>
      ),
    },

    {
      field: "delete",
      headerName: "Delete",
      width: 120,
      renderCell: (params) => (
        <div className="w-full flex justify-center items-center">
          <button
            disabled={deletingId === params.row._id}
            onClick={() => handleDeleteOrder(params.row._id)}
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
    <div className="p-4 md:p-6 w-full min-w-[300px] bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">All Orders</h1>
        <Link to="/create-order">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
            + Create Order
          </button>
        </Link>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-xl shadow p-2 md:p-4 w-full overflow-auto">
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20, 50]}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              color: "#374151",
              fontWeight: 600,
              textAlign: "center",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "600",
              width: "100%",
              textAlign: "center",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fdf2f8",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />
      </div>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          invoice={selectedOrder.invoice || {}}
          onClose={closeOrderDetails}
        />
      )}
    </div>
  );
};

export default Orders;
