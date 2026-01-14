import { useState, useEffect } from "react";
import { FaCheckDouble, FaClock, FaRegCheckCircle, FaEye } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderDetailModal from "./OrderDetailModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/orders");
        setOrders(res.data.orders || res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  // Mark delivered
  const handleUpdateOrder = async (id) => {
    try {
      await userRequest.put(`/orders/${id}`, { status: 2 });
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, status: 2 } : order))
      );
      toast.success("Order marked as delivered!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    }
  };

  // Generate invoice
  const handleGenerateInvoice = async (orderId) => {
    try {
      const { data } = await userRequest.post("/invoices", { orderId });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, invoice: data } : o))
      );
      toast.success("Invoice generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate invoice");
    }
  };

  // Download PDF
  const handleDownloadPDF = (invoiceId) => {
    if (!invoiceId) return toast.error("Invoice not available");
    window.open(`${userRequest.defaults.baseURL}/invoices/${invoiceId}/pdf`, "_blank");
  };

  const openOrderDetails = (order) => setSelectedOrder(order);
  const closeOrderDetails = () => setSelectedOrder(null);

  const columns = [
    { field: "_id", headerName: "Order ID", width: 200 },
    { field: "name", headerName: "Customer Name", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        if (params.value === 0) return <FaClock className="text-yellow-500 text-xl" />;
        if (params.value === 1) return <FaCheckDouble className="text-blue-500 text-xl" />;
        return <FaCheckDouble className="text-green-500 text-xl" />;
      },
    },
    {
      field: "deliver",
      headerName: "Mark Delivered",
      width: 150,
      renderCell: (params) =>
        params.row.status !== 2 ? (
          <FaRegCheckCircle
            className="text-[25px] cursor-pointer text-pink-500 hover:text-pink-600 transition"
            onClick={() => handleUpdateOrder(params.row._id)}
          />
        ) : (
          <span className="text-gray-400 font-medium">Completed</span>
        ),
    },
    {
      field: "details",
      headerName: "View Details",
      width: 150,
      renderCell: (params) => (
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white py-1 px-2 rounded-md transition flex items-center justify-center"
          onClick={() => openOrderDetails(params.row)}
        >
          <FaEye className="mr-2" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full min-w-[300px] bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">All Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-2 md:p-4 w-full overflow-auto">
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
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

      {/* Order Details Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={closeOrderDetails}
        onGenerateInvoice={handleGenerateInvoice} 
        onDownloadInvoice={handleDownloadPDF}
      />
    </div>
  );
};

export default Orders;

