import Timetable from "../models/timeTableModel.js";
import asyncHandler from "express-async-handler";

/*
=====================================================
CREATE TIMETABLE ENTRY
=====================================================
*/

const createTimetable = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      email,
      skinType,
      concerns,
      morningTime,
      eveningTime,
    } = req.body;

    const timetable = new Timetable({
      name,
      email,
      skinType,
      concerns: Array.isArray(concerns) ? concerns : [],
      morningTime,
      eveningTime,
      status: 0, // pending
    });

    const saved = await timetable.save();

    res.status(201).json({
      success: true,
      message: "Timetable created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Timetable creation error:", error);

    res.status(500);
    throw new Error(error.message);
  }
});

/*
=====================================================
GET ALL TIMETABLES (ADMIN) ⭐ PAGINATION
=====================================================
*/

const getAllTimetables = asyncHandler(async (req, res) => {
  let { page = 1, limit = 20, status, search } = req.query;

  page = Math.max(1, parseInt(page));
  limit = Math.max(1, parseInt(limit));

  const query = {};

  if (status !== undefined) query.status = Number(status);

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const timetables = await Timetable.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Timetable.countDocuments(query);

  res.status(200).json({
    success: true,
    data: timetables,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    },
  });
});

/*
=====================================================
GET USER TIMETABLES
=====================================================
*/

const getUserTimetables = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const timetables = await Timetable.find({
    email: req.user.email,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: timetables,
  });
});

/*
=====================================================
UPDATE TIMETABLE STATUS (ADMIN)
=====================================================
*/

const updateTimetableStatus = asyncHandler(async (req, res) => {
  const { status, processedAt } = req.body;

  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    res.status(404);
    throw new Error("Timetable not found");
  }

  const updated = await Timetable.findByIdAndUpdate(
    req.params.id,
    {
      status: status !== undefined ? Number(status) : timetable.status,
      processedAt: processedAt || timetable.processedAt,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Timetable updated successfully",
    data: updated,
  });
});

/*
=====================================================
DELETE TIMETABLE
=====================================================
*/

const deleteTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    res.status(404);
    throw new Error("Timetable not found");
  }

  await Timetable.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Timetable deleted successfully",
  });
});

export {
  createTimetable,
  getAllTimetables,
  getUserTimetables,
  updateTimetableStatus,
  deleteTimetable,
};