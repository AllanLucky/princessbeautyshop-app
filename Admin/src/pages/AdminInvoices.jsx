import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderInvoiceModal from "./OrderDetailModal"; // import the merged modal

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // for modal

  // Fetch invoices from backend
  useEffect(() => {
    const getInvoices = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/invoices");
        console.log("Invoices response:", res.data); // 🔍 check backend structure
        setInvoices(res.data.invoices || res.data); // fallback to array
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };

    getInvoices();
  }, []);

  // Download PDF
  const handleDownloadPDF = (invoiceId) => {
    if (!invoiceId) return toast.error("Invoice not available");
    window.open(`${userRequest.defaults.baseURL}/invoices/${invoiceId}/pdf`, "_blank");
  };

  // Format currency
  const formatKES = (amount) =>
    amount?.toLocaleString("en-KE", { style: "currency", currency: "KES" }) || "-";

  // Generate invoice (if not already generated)
  const handleGenerateInvoice = async (orderId) => {
    try {
      const res = await userRequest.post(`/invoices/generate/${orderId}`);
      toast.success("Invoice generated successfully!");
      // Update invoice in local state
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === orderId ? { ...inv, invoice: res.data } : inv))
      );
      return res.data; // return invoice for modal
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate invoice");
      throw err;
    }
  };

  // DataGrid columns
  const columns = [
    { field: "_id", headerName: "Invoice ID", width: 220 },
    {
      field: "customerName",
      headerName: "Customer Name",
      width: 200,
      valueGetter: (params) => params?.row?.customer?.name || "-"
    },
    {
      field: "customerEmail",
      headerName: "Customer Email",
      width: 220,
      valueGetter: (params) => params?.row?.customer?.email || "-"
    },
    {
      field: "total",
      headerName: "Total",
      width: 150,
      valueGetter: (params) => formatKES(params?.row?.total)
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      valueGetter: (params) => new Date(params?.row?.createdAt).toLocaleString()
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            onClick={async () => {
              if (!params.row.invoice) {
                await handleGenerateInvoice(params.row._id);
              }
              setSelectedInvoice(params.row); // open modal
            }}
          >
            View Invoice
          </button>

          {params.row.invoice && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => handleDownloadPDF(params.row._id)}
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
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onGenerateInvoice={handleGenerateInvoice}
          onDownloadInvoice={handleDownloadPDF}
        />
      )}
    </div>
  );
};

export default AdminInvoices;

