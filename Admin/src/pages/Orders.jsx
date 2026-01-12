import { useState, useEffect } from "react";
import { FaCheckDouble, FaClock, FaRegCheckCircle } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders from server
  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/orders");
        setOrders(res.data.orders || res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err);
        toast.error(err.response?.data?.message || "Failed to fetch orders", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  // Update order status to 'delivered' (2)
  const handleUpdateOrder = async (id) => {
    try {
      await userRequest.put(`/orders/${id}`, { status: 2 });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: 2 } : order
        )
      );
      toast.success("Order marked as delivered!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error updating order status:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to update order", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const columns = [
    { field: "_id", headerName: "Order ID", width: 200 },
    { field: "name", headerName: "Customer Name", width: 200 },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        if (params.value === 0)
          return <FaClock className="text-yellow-500 text-xl" />;
        if (params.value === 1)
          return <FaCheckDouble className="text-blue-500 text-xl" />;
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
  ];

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
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
    </div>
  );
};

export default Orders;

