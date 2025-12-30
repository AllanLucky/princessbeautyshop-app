
import { FaCheckDouble, FaClock, FaRegCheckCircle } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userRequest.get("/orders"); // sends cookies automatically
        const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError("Failed to fetch orders. Make sure you are logged in.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Update order status
  const handleUpdateOrder = async (id) => {
    try {
      await userRequest.put(`/orders/${id}`, { status: 2 }); // 2 = Delivered
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: 2 } : o))
      );
    } catch (err) {
      console.error("Update order error:", err);
      alert("Failed to update order.");
    }
  };

  // Filtered orders based on search
  const filteredOrders = orders.filter(
    (o) =>
      o.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Columns for DataGrid
  const columns = [
    { field: "_id", headerName: "Order ID", width: 200 },
    { field: "name", headerName: "Customer Name", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) =>
        params.row.status === 0 ? (
          <FaClock className="text-yellow-500 text-[25px]" />
        ) : (
          <FaCheckDouble className="text-green-500 text-[25px]" />
        ),
    },
    {
      field: "deliver",
      headerName: "Mark Delivered",
      width: 150,
      renderCell: (params) =>
        params.row.status !== 2 ? (
          <FaRegCheckCircle
            className="text-[25px] cursor-pointer"
            onClick={() => handleUpdateOrder(params.row._id)}
          />
        ) : (
          <span className="text-gray-400">Completed</span>
        ),
    },
  ];

  return (
    <div className="p-5 w-full">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        className="border p-2 mb-4 w-full rounded"
        placeholder="Search orders by ID or name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="h-[500px]">
        <DataGrid
          rows={filteredOrders}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          autoHeight
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default Orders;

