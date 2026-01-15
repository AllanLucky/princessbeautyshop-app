import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";


const OrderInvoiceModal = ({ order, invoice, onClose }) => {
  const invoiceRef = useRef();
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const handleGenerateInvoice = async () => {
    try {
      setLoading(true);
      const { data } = await userRequest.post(`/invoices/generate/${order._id}`);
      toast.success("Invoice generated successfully!");
      window.location.href = `${userRequest.defaults.baseURL}/invoices/download/${data._id}`;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoice?.invoiceNumber || order._id || "NA"}.pdf`);
  };

  const totalAmount =
    invoice?.amount ||
    (order.products || []).reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );

  const invoiceNumber = invoice?.invoiceNumber || `INV-${order._id?.slice(-6) || "000000"}`;
  const invoiceDate = invoice?.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  const paymentMethod = invoice?.paymentMethod || "Not specified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Invoice Details</h2>
          <button
            className="text-gray-600 hover:text-gray-800 font-bold text-xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-6 space-y-6 font-sans text-gray-800">
          {/* Logo + Shop Info */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col items-start">
              <img src={"/blisslogo1.png"} alt="Logo" className="h-16 object-contain mb-2" />
              <p className="text-gray-500 text-sm">TIN: 12345678 | Reg No: BBS-2026</p>
              <p className="text-gray-500 text-sm">www.beautybliss.com | @beautyblissshop</p>
              <p className="text-gray-500 text-sm italic">“Bringing beauty to your doorstep!”</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-pink-600">BEAUTY BLISS SHOP</h1>
              <p className="text-gray-600">123 BeautyBliss Ave, City, Country</p>
              <p className="text-gray-600">Phone: (+254) 788 425 000</p>
              <p className="text-gray-600">Email: info@beautybliss.com</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded">
            <div>
              <p><strong>Invoice Number:</strong> {invoiceNumber}</p>
              <p><strong>Date:</strong> {invoiceDate}</p>
              <p><strong>Payment Method:</strong> {paymentMethod}</p>
            </div>
            <div>
              <p><strong>Order ID:</strong> {order._id || "N/A"}</p>
            </div>
          </div>

          {/* Customer Info */}
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Customer Info</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p><strong>Name:</strong> {order.name || "N/A"}</p>
            <p><strong>Email:</strong> {order.email || "N/A"}</p>
            <p><strong>Phone:</strong> {order.phone || "N/A"}</p>
            <p><strong>Address:</strong> {order.address || "N/A"}</p>
          </div>

          {/* Order Table */}
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Order Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">#</th>
                  <th className="border p-2 text-left">Product</th>
                  <th className="border p-2 text-right">Qty</th>
                  <th className="border p-2 text-right">Unit Price</th>
                  <th className="border p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(order.products || []).length > 0 ? (
                  order.products.map((item, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      <td className="border p-2">{idx + 1}</td>
                      <td className="border p-2">{item.title || "N/A"}</td>
                      <td className="border p-2 text-right">{item.quantity || 0}</td>
                      <td className="border p-2 text-right ">KES {item.price?.toLocaleString() || 0}</td>
                      <td className="border p-2 text-right">
                        KES {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border p-2 text-center" colSpan={5}>No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="text-right mt-4 text-lg font-semibold">
            Total: KES {totalAmount.toLocaleString()}
          </div>

          {/* Thank You + Terms */}
          <p className="text-center mt-6 text-gray-500">
            Thank you for shopping with Beauty Bliss Shop!
          </p>
          <p className="text-center mt-2 text-sm text-gray-400">
            <strong>Terms & Conditions:</strong> All sales are final. Products must be returned within 7 days if defective. Please keep your invoice for any inquiries.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center p-4 border-t space-x-4">
          <button
            onClick={handleGenerateInvoice}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-70"
          >
            {loading ? "Generating..." : "Generate & View Invoice"}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;
