import React, { useState } from "react";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const InvoiceButton = ({ order, onInvoiceGenerated }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerateInvoice = async () => {
    try {
      setLoading(true);

      const { data } = await userRequest.post(
        `/invoices/generate/${order._id}`
      );

      toast.success("Invoice generated successfully!");

      // notify parent instead of mutating props
      if (onInvoiceGenerated) {
        onInvoiceGenerated(order._id, data);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to generate invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!order.invoice)
      return toast.error("Invoice not available");

    window.open(
      `${userRequest.defaults.baseURL}/invoices/order/${order._id}`,
      "_blank"
    );
  };

  if (order.invoice) {
    return (
      <button
        onClick={handleDownloadInvoice}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
        disabled={loading}
      >
        Download Invoice
      </button>
    );
  }

  return (
    <button
      onClick={handleGenerateInvoice}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
      disabled={loading}
    >
      {loading ? "Generating..." : "Generate Invoice"}
    </button>
  );
};

export default InvoiceButton;
