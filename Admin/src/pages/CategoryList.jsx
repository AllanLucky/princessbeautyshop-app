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

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get("/categories");

      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setCategories(data);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= DELETE CATEGORY =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      setDeletingId(id);

      await userRequest.delete(`/categories/${id}`);

      setCategories((prev) =>
        prev.filter((cat) => cat._id !== id)
      );

      toast.success("Category deleted successfully 🗑️");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete category"
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ================= TABLE COLUMNS =================
  const categoryColumns = [
    {
      field: "_id",
      headerName: "ID",
      width: 220,
    },

    {
      field: "name",
      headerName: "Category Name",
      width: 220,
    },

    {
      field: "description",
      headerName: "Description",
      width: 320,
    },

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
              className="w-20 h-20 object-cover rounded-xl border shadow hover:scale-105 transition"
            />
          </div>
        ) : (
          <span className="text-gray-400 text-sm italic">
            No image
          </span>
        ),
    },

    {
      field: "action",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-5">

          <Link to={`/category/${params.row._id}`}>
            <FaEdit className="text-blue-500 text-xl hover:text-blue-700 transition" />
          </Link>

          <button
            disabled={deletingId === params.row._id}
            onClick={() => handleDelete(params.row._id)}
            className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
          >
            <FaTrash className="text-red-500 hover:text-red-700 text-lg" />
          </button>

        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

      <ToastContainer position="top-right" autoClose={2000} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage product categories
          </p>
        </div>

        <button
          onClick={() => navigate("/new-category")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow transition w-full sm:w-auto font-medium"
        >
          + Add Category
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-xl p-5 overflow-x-auto">

        <div className="min-w-[1100px]">

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
                fontSize: "14px",
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
    </div>
  );
};

export default Categories;