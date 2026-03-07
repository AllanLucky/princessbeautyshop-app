import { FaCheckCircle, FaCheckDouble, FaClock, FaSearch, FaTruck, FaBoxOpen, FaTrash } from "react-icons/fa";
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
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

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

        const ordersArray = Array.isArray(res.data)
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

    if (!window.confirm("Are you sure you want to delete this order?"))
      return;

    try {

      setDeletingId(id);

      await userRequest.delete(`/orders/${id}`);

      setOrders(prev =>
        prev.filter(order => order._id !== id)
      );

      toast.success("Order deleted");

    } catch (error) {

      toast.error(error.response?.data?.message || "Failed to delete order");

    } finally {
      setDeletingId(null);
    }
  };

  /*
  =====================================================
  STATUS DISPLAY
  =====================================================
  */

  const getStatusInfo = (order) => {

    switch (order.status) {

      case 0:
        return {
          text: 'Pending',
          color: 'bg-yellow-100 text-yellow-800',
          icon: FaClock
        };

      case 1:
        return {
          text: 'Processing',
          color: 'bg-blue-100 text-blue-800',
          icon: FaTruck
        };

      case 2:
        return {
          text: 'Delivered',
          color: 'bg-green-100 text-green-800',
          icon: FaCheckDouble
        };

      case 3:
        return {
          text: 'Shipped',
          color: 'bg-indigo-100 text-indigo-800',
          icon: FaBoxOpen
        };

      case 4:
        return {
          text: 'Confirmed',
          color: 'bg-teal-100 text-teal-800',
          icon: FaCheckCircle
        };

      case 5:
        return {
          text: 'Cancelled',
          color: 'bg-red-100 text-red-800',
          icon: FaTrash
        };

      default:
        return {
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: FaBoxOpen
        };
    }
  };

  /*
  =====================================================
  COLUMNS
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
      width: 180,
      renderCell: (params) =>
        <div className="font-medium text-gray-900">
          {params.row.name}
        </div>
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
      renderCell: (params) =>
        <span className="font-semibold text-gray-900">
          KES{params.row.total?.toFixed(2) || "0.00"}
        </span>
    },

    /*
    ACTIONS
    */

    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      renderCell: (params) => (

        <div className="flex items-center space-x-2">

          <button
            onClick={() => navigate(`/orders/${params.row._id}`)}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            <FaCheckCircle size={14} />
            <span>Process Order</span>
          </button>

          <button
            onClick={() => handleDeleteOrder(params.row._id)}
            disabled={deletingId === params.row._id}
            className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 text-sm font-medium"
          >
            <FaTrash size={14} />
            <span>Delete</span>
          </button>

        </div>
      )
    }
  ];

  /*
  =====================================================
  SEARCH FILTER
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
  const pendingOrders = filteredOrders.filter(o => o.status === 0).length;
  const processingOrders = filteredOrders.filter(o => o.status === 1).length;
  const deliveredOrders = filteredOrders.filter(o => o.status === 2).length;

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <ToastContainer />

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Order Management
        </h1>

        <p className="text-gray-600 mb-8">
          Manage and track customer orders
        </p>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Orders" value={totalOrders} bgColor="bg-blue-100" icon={<FaBoxOpen />} />
          <StatCard title="Pending" value={pendingOrders} bgColor="bg-yellow-100" icon={<FaClock />} />
          <StatCard title="Processing" value={processingOrders} bgColor="bg-blue-100" icon={<FaTruck />} />
          <StatCard title="Revenue" value={`KES${totalRevenue.toFixed(2)}`} bgColor="bg-green-100" icon={<span>$</span>} />
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 py-2 border rounded-lg"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* DataGrid */}
        <div className="bg-white rounded-xl shadow-sm border p-6">

          <DataGrid
            getRowId={(row)=>row._id}
            rows={filteredOrders}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[30]}
            checkboxSelection
            autoHeight
            loading={loading}
          />

        </div>

      </div>
    </div>
  );
};

/*
=====================================================
STAT CARD COMPONENT
=====================================================
*/

function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>

      <div className={`w-12 h-12 ${bgColor} rounded-lg flex justify-center items-center`}>
        {icon}
      </div>
    </div>
  );
}

export default Orders;