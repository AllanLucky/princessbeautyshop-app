import { useState } from "react";
import { FaCheckDouble, FaClock, FaRegCheckCircle } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "../requestMethods"

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const handleUpdateOrder = async (id) => {
    try {
      await userRequest.put(`/orders/${id}`, { status: 2 });
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
    console.log(setOrders)
  };

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

      <div className="h-[500px]">
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default Orders;
