import Blog from "../models/blogModel.js";
import asyncHandler from "express-async-handler";

/*
====================================================
 CREATE BLOG (ADMIN ONLY USUALLY)
====================================================
*/

const createBlog = asyncHandler(async (req, res) => {
  const { title, content, tags, img, author } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  const blog = await Blog.create({
    title,
    content,
    tags: Array.isArray(tags) ? tags : [],
    img: img || "",
    author: author || req.user?._id,
  });

  res.status(201).json({
    success: true,
    blog,
  });
});

/*
====================================================
 GET ALL BLOGS
====================================================
*/

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    total: blogs.length,
    blogs,
  });
});

/*
====================================================
 GET SINGLE BLOG
====================================================
*/

const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).lean();

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

/*
====================================================
 UPDATE BLOG (SAFE PATCH STYLE)
====================================================
*/

const updateBlog = asyncHandler(async (req, res) => {
  const allowedFields = [
    "title",
    "content",
    "tags",
    "img",
    "author",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

/*
====================================================
 DELETE BLOG
====================================================
*/

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});

export { createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog };