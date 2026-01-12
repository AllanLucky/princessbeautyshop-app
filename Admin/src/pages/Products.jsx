import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { userRequest } from "../requestMethods";
import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await userRequest.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const columns = [
    { field: "_id", headerName: "ID", width: 120 },

    {
      field: "product",
      headerName: "Product",
      width: 300,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 object-cover rounded-lg border"
            src={params.row.img[0]}
            alt={params.row.title}
          />
          <span className="font-semibold text-gray-800">{params.row.title}</span>
        </div>
      ),
    },

    { field: "desc", headerName: "Description", width: 200 },
    {
      field: "originalPrice",
      headerName: "Price (KES)",
      width: 120,
      renderCell: (params) => (
        <span className="font-medium text-gray-700">{params.value}</span>
      ),
    },
    {
      field: "inStock",
      headerName: "In Stock",
      width: 120,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            params.value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },

    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <Link to={`/product/${params.row._id}`}>
          <button className="bg-pink-500 hover:bg-pink-600 text-white py-1 px-3 rounded-md transition">
            Edit
          </button>
        </Link>
      ),
    },

    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <button className="text-red-500 hover:text-red-700">
          <FaTrash />
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 w-[79vw] bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
          All Products
        </h1>
        <Link to="/newproduct">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Create Product
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              color: "#374151",
              fontWeight: 600,
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

export default Products;
