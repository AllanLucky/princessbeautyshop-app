import Clinic from "../models/clinicModel.js";
import asyncHandler from "express-async-handler";

/*
=====================================================
CREATE CLINIC ASSESSMENT
=====================================================
*/

const createClinicAssessment = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      age,
      skinType,
      concerns,
      currentRoutine,
      allergies,
      goals,
      environment,
      stressLevel,
      diet,
      images,
    } = req.body;

    const newAssessment = new Clinic({
      user: req.user?._id || null,
      name,
      email,
      phone,
      age: age ? parseInt(age) : undefined,
      skinType,
      concerns: Array.isArray(concerns) ? concerns : [],
      currentRoutine,
      allergies,
      goals,
      environment,
      stressLevel,
      diet,
      images: Array.isArray(images) ? images : [],
      status: "pending",
    });

    const savedAssessment = await newAssessment.save();

    res.status(201).json({
      success: true,
      message: "Skin assessment submitted successfully",
      data: savedAssessment,
    });
  } catch (error) {
    console.error("Assessment creation error:", error);

    res.status(500);
    throw new Error("Failed to create skin assessment: " + error.message);
  }
});

/*
=====================================================
GET ALL CLINIC ASSESSMENTS (ADMIN) ⭐ PAGINATION
=====================================================
*/

const getAllClinicAssessments = asyncHandler(async (req, res) => {
  let { page = 1, limit = 20, status, search } = req.query;

  page = Math.max(1, parseInt(page));
  limit = Math.max(1, parseInt(limit));

  const query = {};

  if (status) query.status = status;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const assessments = await Clinic.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Clinic.countDocuments(query);

  res.status(200).json({
    success: true,
    data: assessments,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    },
  });
});

/*
=====================================================
GET ASSESSMENT BY ID
=====================================================
*/

const getClinicAssessmentById = asyncHandler(async (req, res) => {
  const assessment = await Clinic.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!assessment) {
    res.status(404);
    throw new Error("Assessment not found");
  }

  res.status(200).json({
    success: true,
    data: assessment,
  });
});

/*
=====================================================
UPDATE ASSESSMENT STATUS (ADMIN)
=====================================================
*/

const updateAssessmentStatus = asyncHandler(async (req, res) => {
  const {
    status,
    expertNotes,
    recommendations,
    assignedExpert,
    analysisResults,
  } = req.body;

  const assessment = await Clinic.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error("Assessment not found");
  }

  const updateData = {};

  if (status) updateData.status = status;
  if (expertNotes) updateData.expertNotes = expertNotes;
  if (recommendations) updateData.recommendations = recommendations;
  if (assignedExpert) updateData.assignedExpert = assignedExpert;
  if (analysisResults) updateData.analysisResults = analysisResults;

  const updatedAssessment = await Clinic.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("user", "name email");

  res.status(200).json({
    success: true,
    message: "Assessment updated successfully",
    data: updatedAssessment,
  });
});

/*
=====================================================
DELETE ASSESSMENT
=====================================================
*/

const deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await Clinic.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error("Assessment not found");
  }

  await Clinic.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Assessment deleted successfully",
  });
});

/*
=====================================================
GET USER ASSESSMENTS
=====================================================
*/

const getUserAssessments = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const assessments = await Clinic.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: assessments,
  });
});

export {
  createClinicAssessment,
  getAllClinicAssessments,
  getClinicAssessmentById,
  updateAssessmentStatus,
  deleteAssessment,
  getUserAssessments,
};