import { FaCheckDouble, FaClock, FaRegCheckCircle } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userRequest.get("/orders");
        const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
        setOrders(data);
      } catch (error) {
        console.error("Fetch orders error:", error);
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
    } catch (error) {
      console.error("Update order error:", error);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(
    (o) =>
      o.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Columns
  const columns = [
    { field: "_id", headerName: "Order ID", width: 150 },
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
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Search orders..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="h-[500px]">
        <DataGrid
          rows={filteredOrders}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          checkboxSelection
          autoHeight
        />
      </div>
    </div>
  );
};

export default Orders;
