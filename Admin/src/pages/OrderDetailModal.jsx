import React, { useRef } from "react";
import { FaFileInvoice, FaTimes } from "react-icons/fa";

const OrderDetailModal = ({ order, onClose, onGenerateInvoice, onDownloadInvoice }) => {
  const formatKES = (amount) =>
    amount.toLocaleString("en-KE", { style: "currency", currency: "KES" });

  const printRef = useRef();

  if (!order) return null;

  // Print modal content
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // restore React
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-2xl font-bold">Order Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="p-6">
          {/* Shop Info */}
          <div className="mb-6 text-gray-700">
            <h3 className="text-xl font-semibold">Beauty Bliss Shop</h3>
            <p>123 BeautyBliss Ave, City, Country</p>
            <p>Phone: (+254) 788425000</p>
            <p>Email: info@beautybliss.com</p>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Customer Info</h4>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Phone:</strong> {order.phone || "-"}</p>
            <p><strong>Address:</strong> {order.address || "-"}</p>
            <p><strong>Order ID:</strong> {order._id}</p>
          </div>

          {/* Products Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Product</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((p, index) => (
                  <tr key={`${p.productId}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{p.title}</td>
                    <td className="px-4 py-2 border">{p.quantity}</td>
                    <td className="px-4 py-2 border">{formatKES(p.price)}</td>
                    <td className="px-4 py-2 border">{formatKES(p.price * p.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end text-lg font-semibold text-gray-800">
            Total: {formatKES(order.total)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <button
            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            onClick={handlePrint}
          >
            <FaFileInvoice className="mr-2" /> Print
          </button>

          {/* Generate or Download Invoice */}
          {order.invoice ? (
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => onDownloadInvoice(order.invoice._id)}
            >
              <FaFileInvoice className="mr-2" /> Download PDF
            </button>
          ) : (
            <button
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => onGenerateInvoice(order._id)}
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

export default OrderDetailModal;
