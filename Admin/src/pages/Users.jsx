import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { userRequest } from "../requestMethods";
import { useEffect, useState } from 'react';

const Users = () => {

    const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await userRequest.get("/users");
        setUsers(response.data.users);
      } catch(error) {
        console.log(error);
      }
    }
    getUsers();
  }, [])





const userColumns = [
  { field: "_id", headerName: "ID", width: 90 },

  {
    field: "user",
    headerName: "User",
    width: 250,
    renderCell: (params) => {
      return (
        <div className="flex items-center">
          <img
            src={params.row.avatar}
            alt=""
            className="h-8 w-8 rounded-full object-cover mr-2"
          />
          <span>{params.row.name}</span>
        </div>
      );
    },
  },

  { field: "email", headerName: "Email", width: 200 },
  { field: "role", headerName: "Role", width: 120 },
  { field: "active", headerName: "Active", width: 120 },

  {
    field: "edit",
    headerName: "Edit",
    width: 100,
    renderCell: (params) => {
      return (
        <Link to={`/user/${params.row._id}`}>
          <button className="bg-gray-400 text-white cursor-pointer w-[70px]">
            Edit
          </button>
        </Link>
      );
    },
  },

];

  return (
     <div className="p-5 w-[79vw]">
      <div className="flex items-center justify-between m-[30px]">
        <h1 className="m-[20px] text-[20px]">All Users</h1>
      </div>
      {/* CREATING TABLE TO DISPLAY PRODUCTS */}
      <div className='m-[15px]'>
          <DataGrid rows={users} checkboxSelection columns={userColumns} getRowId={(row) => row._id} />
      </div>
    </div>
  )
}

export default Users
