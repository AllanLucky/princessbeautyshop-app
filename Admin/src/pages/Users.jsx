import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const Users = () => {
  const userData = [
  {
    _id: 1,
    name: "Lucky Tsori",
    email: "lucky@gmail.com",
    avatar: "https://picsum.photos/100?7",
    role: "Admin",
    active: true
  },
  {
    _id: 2,
    name: "John Doe",
    email: "john@gmail.com",
    avatar: "https://picsum.photos/100?8",
    role: "User",
    active: true
  },
  {
    _id: 3,
    name: "Mary Wanjiku",
    email: "mary@gmail.com",
    avatar: "https://picsum.photos/100?9",
    role: "Manager",
    active: false
  },
  {
    _id: 4,
    name: "Brian Kim",
    email: "brian@gmail.com",
    avatar: "https://picsum.photos/100?10",
    role: "User",
    active: true
  },
  {
    _id: 5,
    name: "Sarah Mumo",
    email: "sarah@gmail.com",
    avatar: "https://picsum.photos/100?11",
    role: "User",
    active: false
  },
  {
    _id: 6,
    name: "Kevin Otieno",
    email: "kevin@gmail.com",
    avatar: "https://picsum.photos/100?12",
    role: "Support",
    active: true
  },
  {
    _id: 7,
    name: "Jackson Otieno",
    email: "kevin@gmail.com",
    avatar: "https://picsum.photos/100?12",
    role: "Support",
    active: true
  },
  {
    _id: 8,
    name: "Kevin Otieno",
    email: "kevin@gmail.com",
    avatar: "https://picsum.photos/100?12",
    role: "Support",
    active: true
  }
];

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

  // {
  //   field: "delete",
  //   headerName: "Delete",
  //   width: 100,
  //   renderCell: () => {
  //     return <FaTrash className="text-red-500 cursor-pointer" />;
  //   },
  // },
];

  return (
     <div className="p-5 w-[79vw]">
      <div className="flex items-center justify-between m-[30px]">
        <h1 className="m-[20px] text-[20px]">All Users</h1>
      </div>
      {/* CREATING TABLE TO DISPLAY PRODUCTS */}
      <div className='m-[15px]'>
          <DataGrid rows={userData} checkboxSelection columns={userColumns} getRowId={(row) => row._id} />
      </div>
    </div>
  )
}

export default Users
