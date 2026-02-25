import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Make sure you have a Product model
      default: null,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["open", "in progress", "resolved", "closed"],
      default: "open",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin or support agent
    },

    attachments: [
      {
        url: String,
        publicId: String,
      },
    ],

    responses: [
      {
        message: {
          type: String,
          required: true,
          trim: true,
        },

        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        postedByModel: {
          type: String,
          enum: ["User", "Admin"],
          default: "User",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* ================= INDEXING FOR PERFORMANCE ================= */
supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ priority: 1 });
supportTicketSchema.index({ createdAt: -1 });

const SupportTicket =
  mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicket;