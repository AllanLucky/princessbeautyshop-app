import React from "react";
import { FaTimes } from "react-icons/fa";
import InvoiceButton from "./InvoiceButton";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  // Calculate totals
  const subTotal = order?.products?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = 0; // optional: add tax logic
  const total = subTotal + tax;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-xl w-11/12 md:w-3/5 p-6 relative shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        {/* Shop Header */}
        <div className="flex flex-col items-center mb-4">
          {/* Optional Logo */}
          <img src="/blisslogo1.png" alt="Beauty Bliss Shop" className="w-24 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">BEAUTY BLISS SHOP</h1>
          <p className="text-gray-500 text-sm">123 BeautyBliss Ave, City, Country</p>
          <p className="text-gray-500 text-sm">Phone: (+254) 788 425 000</p>
          <p className="text-gray-500 text-sm">Email: info@beautybliss.com</p>
          <hr className="my-4 w-full border-gray-200" />
        </div>

        {/* Invoice Header */}
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">INVOICE</h2>
            <p>Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
            <p>Invoice #: {order?.invoice?.invoiceNumber || "Not generated"}</p>
          </div>
          <div>
            <h3 className="font-semibold">CUSTOMER INFO</h3>
            <p>Name: {order?.name}</p>
            <p>Email: {order?.email || "Not provided"}</p>
            <p>Phone: {order?.phone || "Not provided"}</p>
            <p>Address: {order?.address || "Not provided"}</p>
            <p>Order ID: {order?._id}</p>
          </div>
        </div>

        <hr className="border-gray-200 mb-4" />

        {/* Invoice Details */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">INVOICE DETAILS</h3>
          <p>Invoice Date: {order?.invoice?.createdAt ? new Date(order.invoice.createdAt).toLocaleDateString() : "Not generated"}</p>
          <p>Due Date: {order?.dueDate || "Net 30"}</p>
          <p>Terms: {order?.terms || "Net 30"}</p>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">#</th>
                <th className="px-3 py-2 border">Product</th>
                <th className="px-3 py-2 border">Quantity</th>
                <th className="px-3 py-2 border">Unit Price</th>
                <th className="px-3 py-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order?.products?.map((item, index) => (
                <tr key={item._id || index}>
                  <td className="px-3 py-2 border">{index + 1}</td>
                  <td className="px-3 py-2 border">{item.name}</td>
                  <td className="px-3 py-2 border">{item.quantity}</td>
                  <td className="px-3 py-2 border">Ksh {item.price.toLocaleString()}</td>
                  <td className="px-3 py-2 border">Ksh {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end space-y-1 flex-col mb-4">
          <p>Sub Total: Ksh {subTotal?.toLocaleString()}</p>
          <p>Tax: Ksh {tax?.toLocaleString()}</p>
          <p className="font-bold text-lg">Total: Ksh {total?.toLocaleString()}</p>
        </div>

        <p className="text-gray-500 mb-4">Thank you for your business!</p>

        {/* Payment Info */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">PAYMENT BY MAIL</h3>
          <p>Beauty Bliss Shop</p>
          <p>123 BeautyBliss Ave, City, Country</p>
          <p>Zip Code</p>

          <h3 className="font-semibold mt-2 mb-2">PAYMENT BY ACH</h3>
          <p>Bank: Bank Name</p>
          <p>Routing #: 1000 111 222</p>
          <p>Account #: 000 111 222</p>
        </div>

        {/* Invoice Actions */}
        <div className="flex justify-end">
          <InvoiceButton order={order} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
