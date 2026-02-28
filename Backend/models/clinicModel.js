import mongoose from "mongoose";

const ClinicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      min: 0,
    },

    skinType: {
      type: String,
      trim: true,
    },

    concerns: {
      type: [String],
      default: [],
    },

    currentRoutine: String,

    allergies: String,

    goals: String,

    environment: String,

    stressLevel: String,

    diet: String,

    images: {
      type: [String],
      required: true,
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "under_review", "completed", "cancelled"],
      default: "pending",
    },

    expertNotes: String,

    recommendations: [
      {
        product: String,
        category: String,
        reason: String,
        keyIngredients: {
          type: [String],
          default: [],
        },
      },
    ],

    assignedExpert: {
      name: String,
      specialty: String,
      experience: String,
    },

    analysisResults: {
      skinType: String,
      skinToneAnalysis: String,
      melaninProtection: String,

      identifiedIssues: {
        type: [String],
        default: [],
      },

      improvements: {
        type: [String],
        default: [],
      },

      culturalConsiderations: {
        type: [String],
        default: [],
      },

      severity: String,
      timeline: String,

      specialTips: {
        type: [String],
        default: [],
      },
    },

    processingTime: {
      type: String,
      default: "7-14 days",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
==============================
INDEX OPTIMIZATION ⭐
==============================
*/

// Dashboard filtering
ClinicSchema.index({ createdAt: -1 });

// Status filtering
ClinicSchema.index({ status: 1 });

// Email lookup
ClinicSchema.index({ email: 1 });

const Clinic =
  mongoose.models.Clinic || mongoose.model("Clinic", ClinicSchema);

export default Clinic;