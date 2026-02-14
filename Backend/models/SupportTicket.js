const supportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["open", "closed", "pending"], default: "open" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });

export default mongoose.model("SupportTicket", supportTicketSchema);
