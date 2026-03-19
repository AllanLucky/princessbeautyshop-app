import { FaTrash, FaEdit, FaSearch, FaUserPlus } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import { userRequest } from "../requestMethods";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MySwal = withReactContent(Swal);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ================= LOAD USERS =================
  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/users");
        const usersData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.users)
            ? res.data.users
            : [];
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to fetch users");
        MySwal.fire('Error', 'Failed to fetch users', 'error');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  // ================= DELETE USER =================
  const handleDeleteUser = async (userId, userName) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete user "${userName}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await userRequest.delete(`/users/${userId}`);
        setUsers(prev => prev.filter(user => user._id !== userId));
        toast.success(`User "${userName}" deleted successfully`);
        MySwal.fire('Deleted!', `User "${userName}" has been deleted.`, 'success');
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to delete user");
        MySwal.fire('Error', err.response?.data?.message || 'Failed to delete user', 'error');
      }
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 90, headerClassName: 'font-bold text-gray-700' },
    { 
      field: "name", 
      headerName: "Name", 
      width: 180,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {params.row.name?.charAt(0) || 'U'}
          </div>
          <span className="font-medium">{params.row.name || 'Unknown'}</span>
        </div>
      )
    },
    { field: "email", headerName: "Email", width: 220, headerClassName: 'font-bold text-gray-700' },
    { field: "phone", headerName: "Phone", width: 150, headerClassName: 'font-bold text-gray-700' },
    { 
      field: "role", 
      headerName: "Role", 
      width: 120, 
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          params.row.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
        }`}>
          {params.row.role || 'User'}
        </span>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <div className="flex items-center space-x-2">
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200">
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => handleDeleteUser(params.row._id, params.row.name)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ),
    },
  ];

  // ================= FILTER USERS =================
  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Management</h1>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">Filter</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2">
                <FaUserPlus size={14} /> <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* DataGrid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <DataGrid
                getRowId={(row) => row._id}
                rows={filteredUsers}
                columns={columns}
                checkboxSelection
                pageSizeOptions={[10, 30, 50]}
                disableSelectionOnClick
                autoHeight
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': { borderBottom: '1px solid #f3f4f6' },
                  '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' },
                  '& .MuiDataGrid-footerContainer': { backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' },
                  '& .MuiDataGrid-row:hover': { backgroundColor: '#f8fafc' },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;