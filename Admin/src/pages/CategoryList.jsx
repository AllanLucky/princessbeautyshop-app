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

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // ================= GET CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/categories");

        // Backend returns { success, data: [...] }
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories", {
          position: "top-right",
          autoClose: 2500,
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= DELETE CATEGORY =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      setDeletingId(id);
      await userRequest.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully 🗑️", {
        position: "top-right",
        autoClose: 2500,
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Delete failed", {
        position: "top-right",
        autoClose: 2500,
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ================= TABLE COLUMNS =================
  const categoryColumns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Category Name", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) =>
        params.row.image ? (
          <img
            src={params.row.image}
            alt={params.row.name}
            className="w-16 h-16 object-cover rounded"
          />
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
            <FaEdit className="text-blue-500 text-xl cursor-pointer" />
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
        <h1 className="text-2xl font-semibold text-gray-800">All Categories</h1>
        <button
          onClick={() => navigate("/new-category")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 w-full overflow-hidden">
        <DataGrid
          rows={categories}
          columns={categoryColumns}
          getRowId={(row) => row._id || row.id}
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

export default Categories;
