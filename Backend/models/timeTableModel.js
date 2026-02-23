import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    skinType: {
      type: String,
      required: true,
      enum: ["dry", "oily", "combination", "normal", "sensitive"],
      index: true,
    },

    concerns: {
      type: [String],
      enum: ["acne", "aging", "darkSpots", "redness", "dryness", "oiliness"],
      default: [],
    },

    morningTime: {
      type: String,
      default: "7:00 AM",
    },

    eveningTime: {
      type: String,
      default: "9:00 PM",
    },

    /*
    Processing Status
    0 = pending
    1 = processed
    */

    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
      index: true,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
==============================
INDEX OPTIMIZATION ⭐
==============================
*/

timetableSchema.index({ createdAt: -1 });
timetableSchema.index({ email: 1, status: 1 });

export default mongoose.model("Timetable", timetableSchema);