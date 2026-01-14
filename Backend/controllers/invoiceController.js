// backend/controllers/invoiceController.js
import Invoice from "../models/InvoiceModel.js";
import Order from "../models/OrderModel.js";
import jsPDF from "jspdf";

// Create invoice from order
export const createInvoice = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate("user products.productId");
  if (!order) return res.status(404).json({ message: "Order not found" });

  const invoiceNumber = "INV-" + Date.now();

  const newInvoice = new Invoice({
    order: order._id,
    customer: order.user._id,
    invoiceNumber,
    products: order.products.map((p) => ({
      productId: p.productId._id,
      name: p.name,
      quantity: p.quantity,
      price: p.price,
    })),
    subtotal: order.totalAmount,
    tax: order.tax,
    shippingFee: order.shippingFee,
    totalPaid: order.totalAmount + order.tax + order.shippingFee,
    paymentMethod: order.paymentMethod,
    profit: order.profit,
  });

  await newInvoice.save();
  res.status(201).json(newInvoice);
};

// Get invoice by ID
export const getInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.invoiceId).populate("customer order");
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(invoice);
};

// Generate PDF invoice
export const generateInvoicePDF = async (req, res) => {
  const invoice = await Invoice.findById(req.params.invoiceId).populate("customer order");
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Princess Beauty Shop Invoice", 20, 20);

  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
  doc.text(`Customer: ${invoice.customer.name}`, 20, 50);
  doc.text(`Email: ${invoice.customer.email}`, 20, 60);
  doc.text(`Date: ${invoice.createdAt.toDateString()}`, 20, 70);

  let y = 90;
  invoice.products.forEach((p, i) => {
    doc.text(
      `${i + 1}. ${p.name} | Qty: ${p.quantity} | Price: $${p.price}`,
      20,
      y
    );
    y += 10;
  });

  doc.text(`Subtotal: $${invoice.subtotal}`, 20, y + 10);
  doc.text(`Tax: $${invoice.tax}`, 20, y + 20);
  doc.text(`Shipping: $${invoice.shippingFee}`, 20, y + 30);
  doc.text(`Total Paid: $${invoice.totalPaid}`, 20, y + 40);

  const pdfData = doc.output("arraybuffer");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice_${invoice.invoiceNumber}.pdf`
  );
  res.send(Buffer.from(pdfData));
};
