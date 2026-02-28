import { useState, useEffect, useCallback } from "react";
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

  /*
  =====================================================
  FETCH ORDERS (FAST OPTIMIZED ⭐)
  =====================================================
  */

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await userRequest.get("/orders");

      const data =
        res?.data?.orders ||
        res?.data ||
        [];

      setOrders(Array.isArray(data) ? data : []);

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /*
  =====================================================
  MARK AS DELIVERED ⭐ BACKEND SAFE SYNC
  =====================================================
  */

  const handleUpdateOrder = async (id) => {
    if (!id) return;

    try {
      await userRequest.put(`/orders/${id}`, {
        orderStatus: "delivered",
        isDelivered: true,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? {
                ...order,
                orderStatus: "delivered",
                isDelivered: true,
              }
            : order
        )
      );

      toast.success("Order marked as delivered 🎉");

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Update failed"
      );
    }
  };

  /*
  =====================================================
  DELETE ORDER
  =====================================================
  */

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      setDeletingId(id);

      await userRequest.delete(`/orders/${id}`);

      setOrders((prev) =>
        prev.filter((order) => order._id !== id)
      );

      toast.success("Order deleted 🗑️");

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const openOrderDetails = (order) => setSelectedOrder(order);
  const closeOrderDetails = () => setSelectedOrder(null);

  /*
  =====================================================
  STATUS ICON RENDER
  =====================================================
  */

  const renderStatusIcon = (status) => {
    if (status === "processing")
      return <FaClock className="text-yellow-500 text-xl" />;

    if (status === "confirmed")
      return <FaCheckDouble className="text-blue-500 text-xl" />;

    if (status === "delivered")
      return <FaCheckDouble className="text-green-500 text-xl" />;

    return <FaClock className="text-gray-400 text-xl" />;
  };

  /*
  =====================================================
  TABLE COLUMNS
  =====================================================
  */

  const columns = [
    { field: "_id", headerName: "Order ID", width: 220 },
    { field: "name", headerName: "Customer", width: 200 },

    {
      field: "orderStatus",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <div className="flex justify-center w-full">
          {renderStatusIcon(params.value)}
        </div>
      ),
    },

    {
      field: "deliver",
      headerName: "Mark Delivered",
      width: 150,
      renderCell: (params) => (
        <div className="flex justify-center w-full">
          {params.row.orderStatus !== "delivered" ? (
            <FaRegCheckCircle
              className="text-[25px] cursor-pointer text-pink-500 hover:text-pink-600 transition"
              onClick={() => handleUpdateOrder(params.row._id)}
            />
          ) : (
            <span className="text-gray-400 text-sm">Completed</span>
          )}
        </div>
      ),
    },

    {
      field: "details",
      headerName: "View",
      width: 120,
      renderCell: (params) => (
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-md flex items-center justify-center mx-auto"
          onClick={() => openOrderDetails(params.row)}
        >
          <FaEye className="text-xl" />
        </button>
      ),
    },

    {
      field: "delete",
      headerName: "Delete",
      width: 120,
      renderCell: (params) => (
        <button
          disabled={deletingId === params.row._id}
          onClick={() => handleDeleteOrder(params.row._id)}
          className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition mx-auto"
        >
          <FaTrash className="text-red-500 hover:text-red-700 text-xl" />
        </button>
      ),
    },
  ];

  /*
  =====================================================
  UI RENDER
  =====================================================
  */

  return (
    <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
      <ToastContainer />

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">All Orders</h1>

        <Link to="/create-order">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
            + Create Order
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4 w-full overflow-auto">
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>

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