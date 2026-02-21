import Blog from "../models/blogModel.js";
import asyncHandler from "express-async-handler";

/*
====================================================
 CREATE BLOG (ADMIN ONLY)
====================================================
*/

const createBlog = asyncHandler(async (req, res, next) => {
  const { title, content, tags, image, author, excerpt, category } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  const blog = await Blog.create({
    title,
    content,
    excerpt: excerpt || "",
    category: category || "Uncategorized",
    tags: Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim())
      : [],
    image: image || "",
    author: author || req.user?.id,
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

const getAllBlogs = asyncHandler(async (req, res, next) => {
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

const getBlog = asyncHandler(async (req, res, next) => {
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
 UPDATE BLOG
====================================================
*/

const updateBlog = asyncHandler(async (req, res, next) => {
  const allowedFields = [
    "title",
    "content",
    "excerpt",
    "category",
    "tags",
    "image",
    "author",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (updates.tags && typeof updates.tags === "string") {
    updates.tags = updates.tags.split(",").map((t) => t.trim());
  }

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
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

const deleteBlog = asyncHandler(async (req, res, next) => {
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