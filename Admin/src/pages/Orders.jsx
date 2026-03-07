import {
  FaCheckCircle,
  FaCheckDouble,
  FaClock,
  FaSearch,
  FaTruck,
  FaBoxOpen,
  FaTrash
} from "react-icons/fa";

import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [deletingId, setDeletingId] = useState(null);

  /*
  =====================================================
  FETCH ORDERS
  =====================================================
  */

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);

        const res = await userRequest.get("/orders");

        const ordersArray =
          Array.isArray(res.data)
            ? res.data
            : res.data.orders || [];

        setOrders(ordersArray);

      } catch (error) {
        console.error("Fetch orders error:", error);
        setOrders([]);

      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  /*
  =====================================================
  DELETE ORDER
  =====================================================
  */

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      setDeletingId(id);

      await userRequest.delete(`/orders/${id}`);

      setOrders(prev => prev.filter(order => order._id !== id));

      toast.success("Order deleted");

    } catch (error) {

      toast.error(error.message || "Failed to delete order");

    } finally {
      setDeletingId(null);
    }
  };

  /*
  =====================================================
  STATUS INFO HELPER
  =====================================================
  */

  const getStatusInfo = (order) => {
    const status = order.status;

    switch (status) {
      case 0: return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: FaClock, spine: 'bg-yellow-500' };
      case 1: return { text: 'Processing', color: 'bg-blue-100 text-blue-800', icon: FaTruck, spine: 'bg-blue-500' };
      case 2: return { text: 'Delivered', color: 'bg-green-100 text-green-800', icon: FaCheckDouble, spine: 'bg-green-500' };
      case 3: return { text: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: FaBoxOpen, spine: 'bg-indigo-500' };
      case 4: return { text: 'Confirmed', color: 'bg-teal-100 text-teal-800', icon: FaCheckCircle, spine: 'bg-teal-500' };
      case 5: return { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: FaTrash, spine: 'bg-red-500' };
      default: return { text: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: FaBoxOpen, spine: 'bg-gray-400' };
    }
  };

  /*
  =====================================================
  FILTER ORDERS
  =====================================================
  */

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(order =>
        order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  /*
  =====================================================
  STATS
  =====================================================
  */

  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter(order => order.status === 0).length;
  const processingOrders = filteredOrders.filter(order => order.status === 1).length;
  const deliveredOrders = filteredOrders.filter(order => order.status === 2).length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  /*
  =====================================================
  DATA GRID COLUMNS
  =====================================================
  */

  const columns = [

    {
      field: "_id",
      headerName: "Order ID",
      width: 140,
      renderCell: (params) => (
        <Link
          to={`/orders/${params.row._id}`}
          className="text-blue-600 hover:underline font-mono text-sm"
        >
          #{params.row._id.slice(-6)}
        </Link>
      )
    },

    {
      field: "name",
      headerName: "Customer Name",
      width: 180
    },

    {
      field: "email",
      headerName: "Email",
      width: 200
    },

    {
      field: "total",
      headerName: "Total",
      width: 120,
      renderCell: (params) => (
        <span className="font-semibold text-gray-900">
          KES{params.row.total?.toFixed(2) || '0.00'}
        </span>
      )
    },

    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => {

        const { icon: StatusIcon, text, color } =
          getStatusInfo(params.row);

        return (
          <div className="flex items-center">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${color} text-xs font-medium`}>
              <StatusIcon size={12} />
              <span>{text}</span>
            </div>
          </div>
        );
      }
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      renderCell: (params) => {

        const canUpdate = params.row.status < 4;

        return (
          <div className="flex items-center gap-2">

            {canUpdate ? (
              <button
                onClick={() => navigate(`/orders/${params.row._id}`)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
              >
                Update Order
              </button>
            ) : (
              <span className="text-gray-400 text-sm">
                Completed
              </span>
            )}

            <button
              onClick={() => handleDeleteOrder(params.row._id)}
              disabled={deletingId === params.row._id}
              className="px-3 py-2 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100"
            >
              Delete
            </button>

          </div>
        );
      }
    }
  ];

  /*
  =====================================================
  RENDER
  =====================================================
  */

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <ToastContainer />

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Order Management
        </h1>

        <p className="text-gray-600 mb-6">
          Manage customer orders
        </p>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            className="w-full border rounded-lg pl-10 p-2"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* DataGrid */}
        <div className="bg-white rounded-xl shadow border p-4">
          <DataGrid
            getRowId={(row) => row._id}
            rows={filteredOrders}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30]}
            loading={loading}
            autoHeight
          />
        </div>

      </div>
    </div>
  );
};

export default Orders;