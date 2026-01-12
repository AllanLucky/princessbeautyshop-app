import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/users");
        setUsers(res.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const userColumns = [
    { field: "_id", headerName: "ID", width: 220 },

    {
      field: "name",
      headerName: "User",
      width: 280,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <img
            src={params.row.avatar || "/avatar.png"}
            className="h-9 w-9 rounded-full object-cover border"
          />
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">
              {params.row.name}
            </span>
            <span className="text-xs text-gray-500">
              {params.row.email}
            </span>
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
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            params.value
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {params.value ? "Active" : "Disabled"}
        </span>
      ),
    },

    {
      field: "action",
      headerName: "Action",
      width: 140,
      renderCell: (params) => (
        <Link to={`/user/${params.row._id}`}>
          <button className="px-3 py-1 text-sm rounded bg-pink-500 text-white hover:bg-pink-600 transition">
            Edit
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 w-[79vw] bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <span className="text-sm text-gray-500">
          Total: {users.length}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
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


