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
  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/users");

        // show only normal users
        const onlyUsers = res.data.users.filter(
          (u) => u.role === "user" || u.role === "customer"
        );

        // ✅ force isActive to true
        const activeUsers = onlyUsers.map((u) => ({ ...u, isActive: true }));

        setUsers(activeUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error.response?.data || error);

        toast.error("Failed to fetch users", {
          position: "top-right",
          autoClose: 2500,
        });
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeletingId(id);

      await userRequest.delete(`/users/${id}`);

      setUsers((prev) => prev.filter((user) => user._id !== id));

      toast.success("User deleted successfully 🗑️", {
        position: "top-right",
        autoClose: 2500,
      });
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error);

      toast.error(error.response?.data?.message || "Delete failed", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ================= TABLE COLUMNS =================
  const userColumns = [
    { field: "_id", headerName: "ID", width: 220 },

    {
      field: "name",
      headerName: "User",
      width: 280,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">{params.row.name}</span>
            <span className="text-xs text-gray-500">{params.row.email}</span>
          </div>
        </div>
      ),
    },

    {
      field: "role",
      headerName: "Role",
      width: 140,
      renderCell: (params) => (
        <span className="px-3 py-1 rounded-full text-xs bg-pink-100 text-pink-600 font-semibold">
          {params.value}
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
      width: 190,
      renderCell: (params) => (
        <div className="flex items-center gap-8">
          <Link to={`/user/${params.row._id}`}>
               <FaEye className="text-purple-600 text-2xl cursor-pointer mr-10" />
          </Link>

          <button
            disabled={deletingId === params.row._id}
            onClick={() => handleDelete(params.row._id)}
            className="group relative flex items-center justify-center"
          >
            <div className="p-2 rounded-full bg-red-50 group-hover:bg-red-100 transition">
              <FaTrash className="text-red-500 group-hover:text-red-700 text-xl" />
            </div>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full overflow-x-hidden">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-2">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <span className="text-sm text-gray-500">Total: {users.length}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 w-full overflow-hidden">
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
              color: "#374151",
              fontWeight: "600",
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

export default Users;
