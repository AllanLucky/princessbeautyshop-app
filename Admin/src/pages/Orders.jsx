import { FaCheckDouble, FaClock, FaRegCheckCircle } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";

const Orders = () => {
  // ✅ always start with array
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await userRequest.get("/orders");

        // ✅ handle different backend responses safely
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.orders || [];

        setOrders(data);
      } catch (error) {
        console.log("Fetch orders error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []); // ✅ IMPORTANT

  /* ================= UPDATE ORDER ================= */
  const handleUpdateOrder = async (id) => {
    try {
      await userRequest.put(`/orders/${id}`, { status: 2 });

      // update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, status: 2 } : o
        )
      );
    } catch (error) {
      console.log("Update order error:", error);
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const dataColumn = [
    {
      field: "_id",
      headerName: "Order ID",
      width: 120,
      renderCell: (params) => (
        <span className="font-mono text-sm">
          #{params.row._id.slice(-6)}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "Customer",
      width: 180,
      valueGetter: (params) => params.row.name || "N/A",
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "total",
      headerName: "Total Amount",
      width: 130,
      renderCell: (params) => `KES ${params.row.total || 0}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <>
          {params.row.status === 0 ? (
            <FaClock className="text-yellow-500 text-[22px]" />
          ) : (
            <FaCheckDouble className="text-green-500 text-[22px]" />
          )}
        </>
      ),
    },
    {
      field: "deliver",
      headerName: "Mark as Delivered",
      width: 160,
      renderCell: (params) =>
        params.row.status === 0 ? (
          <FaRegCheckCircle
            className="text-[22px] cursor-pointer text-green-600"
            onClick={() => handleUpdateOrder(params.row._id)}
          />
        ) : (
          <span className="text-gray-400 text-sm">Completed</span>
        ),
    },
  ];

  /* ================= UI ================= */
  return (
    <div className="p-5 w-[79vw]">
      <div className="flex items-center justify-between m-[30px]">
        <h1 className="text-[20px] font-semibold">All Orders</h1>
      </div>

      <div className="m-[30px] bg-white rounded-lg shadow">
        <DataGrid
          rows={orders}
          columns={dataColumn}
          getRowId={(row) => row._id}
          checkboxSelection
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 30]}
        />
      </div>
    </div>
  );
};

export default Orders;
