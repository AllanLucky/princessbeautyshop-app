import React, { useRef } from "react";
import { FaFileInvoice, FaTimes } from "react-icons/fa";

const OrderInvoiceModal = ({ order, onClose, onGenerateInvoice, onDownloadInvoice }) => {
  const printRef = useRef();
  if (!order) return null;

  const formatKES = (amount) =>
    amount.toLocaleString("en-KE", { style: "currency", currency: "KES" });

  const subTotal = order.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const tax = order.tax || 0;
  const total = order.total || subTotal + tax;

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
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-50"
        >
          <FaTimes size={24} />
        </button>

        <div ref={printRef} className="p-6 font-sans text-gray-800">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 border-b pb-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src="/blisslogo1.png"
                  alt="Beauty Bliss Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-wider">
                  Beauty Bliss Shop
                </h1>
                <p className="text-gray-500 mt-1 text-sm">123 BeautyBliss Ave, City, Country</p>
                <p className="text-gray-500 text-sm">Phone: (+254) 788 425 000</p>
                <p className="text-gray-500 text-sm">Email: info@beautybliss.com</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-gray-700 uppercase font-semibold tracking-wide text-lg">
                Invoice
              </span>
              <p className="text-gray-500 text-sm mt-1">
                Date: {order.invoice ? new Date(order.invoice.createdAt).toLocaleDateString() : "-"}
              </p>
              <p className="text-gray-500 text-sm">
                Invoice #: {order.invoice?.invoiceNumber || "Not generated"}
              </p>
            </div>
          </div>

          {/* Customer & Invoice Info */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-[250px] shadow-sm">
              <h4 className="font-semibold mb-3 text-gray-700 uppercase tracking-wide">
                Customer Info
              </h4>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phone || "-"}</p>
              <p><strong>Address:</strong> {order.address || "-"}</p>
              <p><strong>Order ID:</strong> {order._id}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-[250px] shadow-sm">
              <h4 className="font-semibold mb-3 text-gray-700 uppercase tracking-wide">
                Invoice Details
              </h4>
              <p><strong>Invoice Date:</strong> {order.invoice ? new Date(order.invoice.createdAt).toLocaleDateString() : "-"}</p>
              <p><strong>Due Date:</strong> {order.invoice ? new Date(order.invoice.dueDate).toLocaleDateString() : "-"}</p>
              <p><strong>Terms:</strong> Net 30</p>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 border">#</th>
                  <th className="px-4 py-3 border">Product</th>
                  <th className="px-4 py-3 border">Quantity</th>
                  <th className="px-4 py-3 border">Unit Price</th>
                  <th className="px-4 py-3 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((p, i) => (
                  <tr key={i} className="even:bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-2 border">{i + 1}</td>
                    <td className="px-4 py-2 border">{p.title}</td>
                    <td className="px-4 py-2 border">{p.quantity}</td>
                    <td className="px-4 py-2 border">{formatKES(p.price)}</td>
                    <td className="px-4 py-2 border">{formatKES(p.price * p.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg shadow">
              <div className="flex justify-between mb-2">
                <span>Sub Total:</span>
                <span>{formatKES(subTotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax:</span>
                <span>{formatKES(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatKES(total)}</span>
              </div>
            </div>
          </div>

          {/* Thank you note */}
          <div className="text-center font-semibold mt-6 text-gray-700">
            Thank you for your business!
          </div>

          {/* Payment Info */}
          <div className="mt-8 flex flex-wrap gap-6 border-t pt-4">
            <div className="flex-1 min-w-[250px] bg-gray-50 p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2 text-gray-700 uppercase tracking-wide">
                Payment by Mail
              </h4>
              <p>Beauty Bliss Shop</p>
              <p>123 BeautyBliss Ave</p>
              <p>City, Country</p>
              <p>Zip Code</p>
            </div>
            <div className="flex-1 min-w-[250px] bg-gray-50 p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2 text-gray-700 uppercase tracking-wide">
                Payment by ACH
              </h4>
              <p><strong>Bank:</strong> Bank Name</p>
              <p><strong>Routing #:</strong> 1000 111 222</p>
              <p><strong>Account #:</strong> 000 111 2222</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 mt-6">
          <button
            className="flex items-center px-5 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            onClick={handlePrint}
          >
            <FaFileInvoice className="mr-2" /> Print
          </button>

          {order.invoice ? (
            <button
              className="flex items-center px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => onDownloadInvoice(order.invoice._id)}
            >
              <FaFileInvoice className="mr-2" /> Download PDF
            </button>
          ) : (
            <button
              className="flex items-center px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => onGenerateInvoice(order._id)}
            >
              <FaFileInvoice className="mr-2" /> Generate Invoice
            </button>
          )}

          <button
            className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;
