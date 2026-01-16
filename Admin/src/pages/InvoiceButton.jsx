import React, { useState } from "react";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const InvoiceButton = ({ order, onInvoiceGenerated }) => {
  const [loading, setLoading] = useState(false);

  // Generate invoice on server
  const handleGenerateInvoice = async () => {
    if (!order?._id) return toast.error("Invalid order");

    try {
      setLoading(true);

      const { data } = await userRequest.post(`/invoices/generate/${order._id}`);

      toast.success("Invoice generated successfully!");

      // Notify parent
      if (onInvoiceGenerated) onInvoiceGenerated(order._id, data);

      // Open generated invoice PDF
      window.open(`${userRequest.defaults.baseURL}/invoices/download/${data._id}`, "_blank");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate invoice");
    } finally {
      setLoading(false);
    }
  };

  // Download existing invoice
  const handleDownloadInvoice = () => {
    if (!order?.invoice?._id) {
      return toast.error("Invoice not available");
    }

    window.open(`${userRequest.defaults.baseURL}/invoices/download/${order.invoice._id}`, "_blank");
  };

  // Determine button type and label
  const isInvoiceGenerated = !!order?.invoice;

  return (
    <button
      onClick={isInvoiceGenerated ? handleDownloadInvoice : handleGenerateInvoice}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-white transition font-semibold 
        ${isInvoiceGenerated 
          ? "bg-green-600 hover:bg-green-700" 
          : "bg-blue-600 hover:bg-blue-700"
        } 
        ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading ? (isInvoiceGenerated ? "Loading..." : "Generating...") 
               : (isInvoiceGenerated ? "Download Invoice" : "Generate Invoice")}
    </button>
  );
};

export default InvoiceButton;
