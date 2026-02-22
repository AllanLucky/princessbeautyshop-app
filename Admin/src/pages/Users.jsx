import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { FaEye, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // ================= GET USERS =================
  const getUsers = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get("/users");

      const onlyUsers = res.data.users.filter(
        (u) => u.role === "user" || u.role === "customer"
      );

      setUsers(
        onlyUsers.map((u) => ({
          ...u,
          isActive: true,
        }))
      );

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      setDeletingId(id);

      await userRequest.delete(`/users/${id}`);

      setUsers((prev) => prev.filter((user) => user._id !== id));

      toast.success("User deleted successfully 🗑️");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ================= TABLE COLUMNS =================
  const userColumns = [
    {
      field: "_id",
      headerName: "ID",
      width: 220,
    },

    {
      field: "user",
      headerName: "User Info",
      width: 320,
      renderCell: (params) => {
        const user = params.row;

        return (
          <div className="flex flex-col justify-center h-full leading-tight">
            <span className="font-semibold text-gray-800">
              {user?.name || "No Name"}
            </span>

            <span className="text-sm text-gray-500">
              {user?.email || "No Email"}
            </span>
          </div>
        );
      },
    },

    {
      field: "role",
      headerName: "Role",
      width: 140,
      renderCell: (params) => (
        <span className="px-3 py-1 rounded-full text-xs bg-pink-100 text-pink-600 font-semibold capitalize">
          {params.value || "user"}
        </span>
      ),
    },

    {
      field: "isActive",
      headerName: "Status",
      width: 140,
      renderCell: () => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
          Active
        </span>
      ),
    },

    {
      field: "action",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-6">

          <Link to={`/user/${params.row._id}`}>
            <FaEye className="text-purple-600 text-xl cursor-pointer hover:scale-110 transition" />
          </Link>

          <button
            disabled={deletingId === params.row._id}
            onClick={() => handleDelete(params.row._id)}
          >
            <div className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition">
              <FaTrash className="text-red-500 hover:text-red-700 text-lg" />
            </div>
          </button>

        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Customers
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage registered users
          </p>
        </div>

        <span className="bg-white shadow px-4 py-2 rounded-lg text-sm">
          Total Users: {users.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl p-5 overflow-hidden">

        <DataGrid
          rows={users}
          columns={userColumns}
          getRowId={(row) => row._id}
          loading={loading}
          autoHeight
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick

          sx={{
            border: "none",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              fontWeight: "600",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fdf2f8",
            },

            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f3f4f6",
              fontSize: "14px",
            },
          }}
        />

      </div>
    </div>
  );
};

export default Users;