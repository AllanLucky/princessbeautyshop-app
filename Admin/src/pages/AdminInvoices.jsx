import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderInvoiceModal from "./OrderDetailModal"; // Merged modal for invoice

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // modal state

  // Fetch all invoices
  useEffect(() => {
    const getInvoices = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/invoices");
        console.log("Invoices response:", res.data);
        setInvoices(res.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };

    getInvoices();
  }, []);

  // Format currency
  const formatKES = (amount) =>
    amount?.toLocaleString("en-KE", { style: "currency", currency: "KES" }) || "-";

  // Open PDF in new tab
  const handleDownloadPDF = (pdfUrl) => {
    if (!pdfUrl) return toast.error("Invoice PDF not available");
    window.open(`${userRequest.defaults.baseURL}/${pdfUrl}`, "_blank");
  };

  // DataGrid columns
  const columns = [
    { field: "_id", headerName: "Invoice ID", width: 220 },
    {
      field: "customerName",
      headerName: "Customer Name",
      width: 200,
      valueGetter: (params) => params?.row?.order?.name || "-"
    },
    {
      field: "customerEmail",
      headerName: "Customer Email",
      width: 220,
      valueGetter: (params) => params?.row?.order?.email || "-"
    },
    {
      field: "total",
      headerName: "Total",
      width: 150,
      valueGetter: (params) => formatKES(params?.row?.amount)
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      valueGetter: (params) =>
        new Date(params?.row?.order?.createdAt || params?.row?.createdAt).toLocaleString()
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <div className="flex space-x-2">
          {/* View Invoice Modal */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            onClick={() => setSelectedInvoice(params.row)}
          >
            View Invoice
          </button>

          {/* Download PDF */}
          {params.row.pdfUrl && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => handleDownloadPDF(params.row.pdfUrl)}
            >
              Download PDF
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 w-full min-h-screen bg-gray-50">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-gray-800">All Invoices</h1>

      <div className="bg-white rounded-xl shadow p-2 md:p-4 w-full overflow-auto">
        <DataGrid
          rows={invoices || []}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              color: "#374151",
              fontWeight: 600
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fdf2f8"
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f3f4f6"
            }
          }}
        />
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <OrderInvoiceModal
          order={selectedInvoice.order} // pass order details
          invoice={selectedInvoice}     // pass invoice info
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default AdminInvoices;
