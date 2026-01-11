import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👇 REQUIRED for pagination selector
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/users");

        // backend sends { success, users }
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
      width: 250,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.avatar || "/avatar.png"}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span>{params.row.name}</span>
        </div>
      ),
    },

    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "isActive", headerName: "Active", width: 120 },

    {
      field: "edit",
      headerName: "Edit",
      width: 120,
      renderCell: (params) => (
        <Link to={`/user/${params.row._id}`}>
          <button className="bg-gray-500 px-3 py-1 text-white rounded">
            Edit
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div className="p-5 w-[79vw]">
      <h1 className="text-xl mb-4">All Users</h1>

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
      />
    </div>
  );
};

export default Users;

