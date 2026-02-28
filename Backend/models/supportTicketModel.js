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
      ref: "Product",
      default: null,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
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
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    versionKey: false,
  }
);

/* =====================================================
 PERFORMANCE INDEXES (NO DUPLICATE INDEXES)
===================================================== */

// Ticket filtering performance
supportTicketSchema.index({ user: 1, status: 1 });

// Priority sorting/filtering
supportTicketSchema.index({ priority: 1 });

// Latest ticket listing
supportTicketSchema.index({ createdAt: -1 });

const SupportTicket =
  mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicket;