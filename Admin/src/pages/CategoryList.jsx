import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/categories");
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setCategories(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      setDeletingId(id);
      await userRequest.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully 🗑️");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const categoryColumns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Category Name", width: 220 },
    { field: "description", headerName: "Description", width: 320 },
    {
      field: "image",
      headerName: "Image",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.row.image ? (
          <div className="flex justify-center w-full">
            <img
              src={params.row.image}
              alt={params.row.name}
              className="w-20 h-20 object-cover rounded-xl border shadow-sm hover:scale-105 transition"
            />
          </div>
        ) : (
          <span className="text-gray-400 italic">No image</span>
        ),
    },
    {
      field: "action",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-4">
          <Link to={`/category/${params.row._id}`}>
            <FaEdit className="text-blue-500 text-xl hover:text-blue-700" />
          </Link>
          <button
            disabled={deletingId === params.row._id}
            onClick={() => handleDelete(params.row._id)}
            className="p-2 rounded-full bg-red-50 hover:bg-red-100"
          >
            <FaTrash className="text-red-500 text-xl" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Categories</h1>
        <button
          onClick={() => navigate("/new-category")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          + Add Category
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <DataGrid
          rows={categories}
          columns={categoryColumns}
          getRowId={(row) => row._id}
          loading={loading}
          rowHeight={90}
          autoHeight
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              fontWeight: "600",
            },
            "& .MuiDataGrid-row": { alignItems: "center" },
            "& .MuiDataGrid-row:hover": { backgroundColor: "#fdf2f8" },
            "& .MuiDataGrid-cell": { borderBottom: "1px solid #f3f4f6" },
          }}
        />
      </div>
    </div>
  );
};

export default Categories;
