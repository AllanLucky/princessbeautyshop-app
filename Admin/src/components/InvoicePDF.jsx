import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoicePDF = ({ invoice, order }) => {
  const invoiceRef = useRef();

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    const element = invoiceRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div>
      <div ref={invoiceRef} className="bg-white p-6 rounded shadow w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">BEAUTY BLISS SHOP</h1>
        <p className="text-center mb-1">123 BeautyBliss Ave, City, Country</p>
        <p className="text-center mb-4">Phone: (+254) 788 425 000 | Email: info@beautybliss.com</p>

        <h2 className="text-xl font-semibold mb-2">Invoice</h2>
        <p>Invoice Number: {invoice.invoiceNumber}</p>
        <p>Order ID: {order._id}</p>
        <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>

        <h3 className="text-lg font-semibold mt-4">Customer Info</h3>
        <p>Name: {order.name}</p>
        <p>Email: {order.email}</p>
        <p>Phone: {order.phone || "N/A"}</p>
        <p>Address: {order.address || "N/A"}</p>

        <h3 className="text-lg font-semibold mt-4">Order Details</h3>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item, idx) => (
              <tr key={item.productId}>
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{item.title}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">KES {item.price.toLocaleString()}</td>
                <td className="border p-2">
                  KES {(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-right mt-4 font-semibold">
          Total: KES {invoice.amount.toLocaleString()}
        </p>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePDF;

