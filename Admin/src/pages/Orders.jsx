import { FaCheckCircle, FaCheckDouble, FaClock, FaSearch, FaTruck, FaBoxOpen, FaTrash } from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [deletingId, setDeletingId] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/orders");
        const ordersArray = Array.isArray(res.data) ? res.data : res.data.orders || [];
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

  // Handle marking order as delivered
  const handleUpdateOrder = async (id) => {
    try {
      const res = await userRequest.put(`/orders/${id}`, { status: 2 });
      const updatedOrder = res.data.order;

      setOrders(orders.map(order =>
        order._id === id
          ? { ...order, status: updatedOrder.status, orderStatus: updatedOrder.orderStatus }
          : order
      ));

      toast.success("Order marked as delivered");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    }
  };

  // Handle deleting order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      setDeletingId(id);
      await userRequest.delete(`/orders/${id}`);
      setOrders(orders.filter(order => order._id !== id));
      toast.success("Order deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  // Status info helper with spine color
  const getStatusInfo = (order) => {
    const status = order.orderStatus ? order.orderStatus.toLowerCase() : order.status;
    switch (status) {
      case 'pending':
      case 0:
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: FaClock, spine: 'bg-yellow-500' };
      case 'processing':
      case 1:
        return { text: 'Processing', color: 'bg-blue-100 text-blue-800', icon: FaTruck, spine: 'bg-blue-500' };
      case 'delivered':
      case 2:
        return { text: 'Delivered', color: 'bg-green-100 text-green-800', icon: FaCheckDouble, spine: 'bg-green-500' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: FaBoxOpen, spine: 'bg-gray-400' };
    }
  };

  // Columns for DataGrid
  const columns = [
    { 
      field: "_id", 
      headerName: "Order ID", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => <span className="font-mono text-sm text-gray-600">#{params.row._id.slice(-6)}</span>
    },
    { 
      field: "name", 
      headerName: "Customer Name", 
      width: 180,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => <div className="font-medium text-gray-900">{params.row.name}</div>
    },
    { field: "email", headerName: "Email", width: 200, headerClassName: 'font-bold text-gray-700' },
    { 
      field: "total", 
      headerName: "Total", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => <span className="font-semibold text-gray-900">KES{params.row.total?.toFixed(2) || '0.00'}</span>
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        const { icon: StatusIcon, text, color, spine } = getStatusInfo(params.row);
        return (
          <div className="flex items-center">
            {/* Spine */}
            <div className={`w-1 h-full rounded-l ${spine} mr-2`}></div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-r-full ${color} text-xs font-medium`}>
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
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        const canDeliver = params.row.status === 0 || params.row.status === 1;
        return (
          <div className="flex items-center space-x-2">
            {canDeliver ? (
              <button
                onClick={() => handleUpdateOrder(params.row._id)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
              >
                <FaCheckCircle size={14} />
                <span>Mark Delivered</span>
              </button>
            ) : (
              <span className="text-gray-400 text-sm font-medium">Completed</span>
            )}
            <button
              onClick={() => handleDeleteOrder(params.row._id)}
              disabled={deletingId === params.row._id}
              className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 text-sm font-medium"
            >
              <FaTrash size={14} />
              <span>Delete</span>
            </button>
          </div>
        );
      }
    }
  ];

  // Filter orders by search
  const filteredOrders = Array.isArray(orders) ? orders.filter(order =>
    order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Stats
  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter(order => order.status === 0).length;
  const processingOrders = filteredOrders.filter(order => order.status === 1).length;
  const deliveredOrders = filteredOrders.filter(order => order.status === 2).length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Orders" value={totalOrders} icon={<FaBoxOpen className="text-blue-600 text-xl" />} bgColor="bg-blue-100" />
          <StatCard title="Pending" value={pendingOrders} icon={<FaClock className="text-yellow-600 text-xl" />} bgColor="bg-yellow-100" />
          <StatCard title="Processing" value={processingOrders} icon={<FaTruck className="text-blue-600 text-xl" />} bgColor="bg-blue-100" />
          <StatCard title="Total Revenue" value={`KES${totalRevenue.toFixed(2)}`} icon={<span className="text-green-600 font-bold text-lg">$</span>} bgColor="bg-green-100" />
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by customer name, email, or order ID..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* DataGrid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
          <DataGrid
            getRowId={(row) => row._id}
            rows={filteredOrders}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[30]}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
            loading={loading}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': { borderBottom: '1px solid #f3f4f6' },
              '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' },
              '& .MuiDataGrid-footerContainer': { backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' },
              '& .MuiDataGrid-row:hover': { backgroundColor: '#f8fafc' },
            }}
          />
        </div>

      </div>
    </div>
  );
};

// Reusable stat card
function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

export default Orders;