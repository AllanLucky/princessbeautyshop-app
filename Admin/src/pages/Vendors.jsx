import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // ================= GET VENDORS =================
  useEffect(() => {
    const getVendors = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/vendors");

        // Ensure vendors is always an array
        const data = Array.isArray(res.data) ? res.data : res.data?.vendors || [];
        setVendors(data);
      } catch (error) {
        console.error("Failed to fetch vendors:", error.response?.data || error);
        toast.error("Failed to fetch vendors", {
          position: "top-right",
          autoClose: 2500,
        });
      } finally {
        setLoading(false);
      }
    };

    getVendors();
  }, []);

  // ================= DELETE VENDOR =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      setDeletingId(id);

      await userRequest.delete(`/vendors/${id}`);

      setVendors((prev) => prev.filter((vendor) => vendor._id !== id));

      toast.success("Vendor deleted successfully 🗑️", {
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
  const vendorColumns = [
    { field: "_id", headerName: "ID", width: 220 },

    {
      field: "name",
      headerName: "Vendor",
      width: 250,
      renderCell: (params) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{params.row.name}</span>
          <span className="text-xs text-gray-500">{params.row.email}</span>
        </div>
      ),
    },

    {
      field: "status",
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
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-4">
          <Link to={`/vendor/${params.row._id}`}>
            <FaEdit className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer mr-10" />
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

       {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">All Vendors</h1>
        <Link to="/create-vendor">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
            + Create Vendor
          </button>
          {/* <span className="text-sm text-gray-500">Total: {vendors.length}</span> */}
        </Link>
      </div>



      <div className="bg-white rounded-xl shadow-sm p-4 w-full overflow-hidden">
        <DataGrid
          rows={vendors}
          columns={vendorColumns}
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

export default Vendors;
