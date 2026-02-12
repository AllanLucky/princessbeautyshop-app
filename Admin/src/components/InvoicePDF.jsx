import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoicePDF = ({ invoice = {}, order = { products: [] } }) => {
  const invoiceRef = useRef();

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoice.invoiceNumber || "NotGenerated"}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  const subtotal = order.products.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div
        ref={invoiceRef}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto"
        style={{ fontFamily: "Arial, sans-serif", color: "#1f2937" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <div>
            <h1 className="text-2xl font-bold">BEAUTY BLISS SHOP</h1>
            <p className="text-gray-600 text-sm">123 BeautyBliss Ave, City, Country</p>
            <p className="text-gray-600 text-sm">Phone: (+254) 788 425 000</p>
            <p className="text-gray-600 text-sm">Email: info@beautybliss.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
            <p><strong>Date:</strong> {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "-"}</p>
            <p><strong>Invoice #:</strong> {invoice.invoiceNumber || "-"}</p>
            <p><strong>Order ID:</strong> {order._id || "-"}</p>
            <p><strong>Payment Method:</strong> {invoice.paymentMethod || "-"}</p>
          </div>
        </div>

        {/* Customer Info */}
        <h3 className="text-lg font-semibold mb-2 border-b pb-1 text-gray-700">CUSTOMER INFO</h3>
        <div className="grid grid-cols-2 gap-6 mb-6 text-gray-700">
          <p><strong>Name:</strong> {order.name || "-"}</p>
          <p><strong>Email:</strong> {order.email || "-"}</p>
          <p><strong>Phone:</strong> {order.phone || "-"}</p>
          <p><strong>Address:</strong> {order.address || "-"}</p>
        </div>

        {/* Order Table */}
        <h3 className="text-lg font-semibold mb-2 border-b pb-1 text-gray-700">ORDER DETAILS</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 border-collapse text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">#</th>
                <th className="border p-2 text-left">Product</th>
                <th className="border p-2 text-right">Quantity</th>
                <th className="border p-2 text-right">Unit Price</th>
                <th className="border p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.products.length > 0 ? (
                order.products.map((item, idx) => (
                  <tr key={idx} className="even:bg-gray-50">
                    <td className="border p-2">{idx + 1}</td>
                    <td className="border p-2">{item.title || "-"}</td>
                    <td className="border p-2 text-right">{item.quantity || 0}</td>
                    <td className="border p-2 text-right">Ksh {(item.price || 0).toLocaleString()}</td>
                    <td className="border p-2 text-right">Ksh {((item.price || 0) * (item.quantity || 0)).toLocaleString()}</td>
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

        {/* Totals */}
        <div className="mt-4 flex justify-end flex-col text-gray-800 font-semibold">
          <div>Sub Total: Ksh {subtotal.toLocaleString()}</div>
          <div>Tax: Ksh 0.00</div>
          <div className="text-yellow-600 text-lg font-bold">Total: Ksh {subtotal.toLocaleString()}</div>
        </div>

        {/* Footer: Thank you + Terms */}
        <div className="mt-8 border-t pt-4 text-center text-gray-500 text-sm">
          <p>Thank you for shopping with Beauty Bliss Shop!</p>
          <p className="mt-1">
            <strong>Terms & Conditions:</strong> All sales are final. Products must be returned within 7 days if defective. Please keep your invoice for any inquiries.
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleDownloadPDF}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePDF;



