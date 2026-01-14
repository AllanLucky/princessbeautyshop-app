import React, { useRef } from "react";
import { FaFileInvoice, FaTimes } from "react-icons/fa";

const InvoiceDetailModal = ({ invoice, onClose, onDownloadInvoice, onGenerateInvoice }) => {
  const printRef = useRef();

  if (!invoice) return null;

  // Format currency
  const formatKES = (amount) =>
    amount.toLocaleString("en-KE", { style: "currency", currency: "KES" });

  // Calculate subtotal, tax, total
  const subTotal = invoice.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const tax = invoice.tax || 0; // you can set a default tax
  const totalDue = subTotal + tax;

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-50"
        >
          <FaTimes size={20} />
        </button>

        {/* Invoice Content */}
        <div ref={printRef} className="text-sm text-gray-800">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Beauty Bliss Shop</h1>
                <p>123 BeautyBliss Ave</p>
                <p>City, Country</p>
                <p>Phone: (+254) 788 425 000</p>
                <p>Email: info@beautybliss.com</p>
              </div>
              <div className="w-24 h-24 border flex items-center justify-center text-gray-600">
                Logo
              </div>
            </div>
          </div>

          {/* Bill To & Invoice Details */}
          <div className="p-6 border-b flex justify-between flex-wrap gap-6">
            <div>
              <h3 className="font-semibold mb-2">BILL TO</h3>
              <p>{invoice.customerDetails.name}</p>
              <p>{invoice.customerDetails.email}</p>
              <p>{invoice.customerDetails.phone || "-"}</p>
              <p>{invoice.customerDetails.address || "-"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">INVOICE DETAILS</h3>
              <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Invoice Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p><strong>Terms:</strong> Net 30</p>
            </div>
          </div>

          {/* Product Table */}
          <div className="p-6 overflow-x-auto">
            <table className="w-full border border-gray-300 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Product</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Unit Price</th>
                  <th className="px-4 py-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoice.products.map((p, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{p.title}</td>
                    <td className="px-4 py-2 border">{p.quantity}</td>
                    <td className="px-4 py-2 border">{formatKES(p.price)}</td>
                    <td className="px-4 py-2 border">{formatKES(p.price * p.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-6 w-full md:w-1/3 ml-auto space-y-2">
              <div className="flex justify-between">
                <span>Sub Total:</span>
                <span>{formatKES(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatKES(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Due:</span>
                <span>{formatKES(totalDue)}</span>
              </div>
            </div>

            <div className="mt-6 text-center font-semibold">
              Thank you for your business!
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-6 border-t flex justify-between flex-wrap gap-6">
            <div>
              <h4 className="font-semibold mb-1">Payment by Mail:</h4>
              <p>Beauty Bliss Shop</p>
              <p>123 BeautyBliss Ave</p>
              <p>City, Country</p>
              <p>Zip Code</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Payment by ACH:</h4>
              <p><strong>Bank:</strong> Bank Name</p>
              <p><strong>Routing #:</strong> 1000 111 222</p>
              <p><strong>Account #:</strong> 000 111 2222</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end p-4 border-t bg-gray-50 space-x-3">
          <button
            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            onClick={handlePrint}
          >
            <FaFileInvoice className="mr-2" /> Print
          </button>

          {invoice._id ? (
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => onDownloadInvoice(invoice._id)}
            >
              <FaFileInvoice className="mr-2" /> Download PDF
            </button>
          ) : (
            <button
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => onGenerateInvoice(invoice.orderId)}
            >
              <FaFileInvoice className="mr-2" /> Generate Invoice
            </button>
          )}

          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;

