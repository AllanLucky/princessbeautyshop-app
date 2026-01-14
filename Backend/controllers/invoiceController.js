import Invoice from "../models/invoiceModel.js";
import Order from "../models/orderModel.js";

/**
 * CREATE INVOICE FROM ORDER (ADMIN ONLY)
 */
export const createInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const existingInvoice = await Invoice.findOne({ order: order._id });
    if (existingInvoice)
      return res.status(400).json({ message: "Invoice already exists for this order" });

    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await Invoice.create({
      order: order._id,
      customer: order.customer,
      customerDetails: {
        name: order.name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city || "",
        country: order.country || "",
      },
      products: order.products.map(p => ({
        productId: p.productId,
        name: p.title,
        quantity: p.quantity,
        price: p.price,
      })),
      subtotal: order.total,
      tax: 0,
      shippingFee: 0,
      totalPaid: order.total,
      paymentMethod: "Stripe",
      invoiceNumber,
      createdBy: req.user._id,
    });

    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

/**
 * GET INVOICE BY ID (ADMIN OR OWNER)
 */
export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    if (req.user.role !== "admin" && req.user.email !== invoice.customerDetails.email)
      return res.status(403).json({ message: "Access denied" });

    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

/**
 * GENERATE PDF FOR INVOICE
 */
export const generateInvoicePDF = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    if (req.user.role !== "admin" && req.user.email !== invoice.customerDetails.email)
      return res.status(403).json({ message: "Access denied" });

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    // HEADER
    doc.setFontSize(18);
    doc.text("Princess Beauty Shop", 20, 20);

    doc.setFontSize(10);
    doc.text("123 BeautyBliss Ave, City, Country", 20, 28);
    doc.text("Phone: (+254) 788 425 000", 20, 34);
    doc.text("Email: info@beautybliss.com", 20, 40);

    // INVOICE INFO
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 55);
    doc.text(`Date: ${invoice.createdAt.toDateString()}`, 20, 62);

    // CUSTOMER INFO
    doc.text("Bill To:", 20, 75);
    doc.text(invoice.customerDetails.name, 20, 82);
    doc.text(invoice.customerDetails.email, 20, 88);
    doc.text(invoice.customerDetails.address || "-", 20, 94);

    // PRODUCTS
    let y = 110;
    invoice.products.forEach((p, i) => {
      doc.text(`${i + 1}. ${p.name} | Qty: ${p.quantity} | KES ${p.price}`, 20, y);
      y += 8;
    });

    // TOTAL
    y += 10;
    doc.text(`Total Paid: KES ${invoice.totalPaid}`, 20, y);

    const pdfData = doc.output("arraybuffer");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${invoice.invoiceNumber}.pdf`
    );
    res.send(Buffer.from(pdfData));
  } catch (error) {
    next(error);
  }
};

/**
 * LIST ALL INVOICES (ADMIN ONLY)
 */
export const listInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE INVOICE (ADMIN ONLY)
 */
export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await invoice.remove();
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    next(error);
  }
};
