import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WishlistUsers = () => {
  const { id } = useParams(); // product ID
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlistUsers = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get(`/products/wishlist-users/${id}`);
        console.log("Wishlist response:", res.data); // 🔎 Debug
        setUsers(res.data.wishlistUsers || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistUsers();
  }, [id]);

  const columns = [
    { field: "_id", headerName: "User ID", width: 220 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "createdAt", headerName: "Joined At", width: 180 },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Wishlist Users</h1>
      <div className="bg-white rounded-xl shadow p-4">
        <DataGrid
          rows={users.map((u) => ({ ...u, id: u._id }))}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              background: "#f9fafb",
              fontWeight: "600",
            },
          }}
        />
      </div>
    </div>
  );
};

export default WishlistUsers;
