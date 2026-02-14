import Blog from "../models/blogModel.js";
import asyncHandler from "express-async-handler";

// ================= CREATE BLOG =================
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, author, tags, img } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  const newBlog = await Blog.create({
    title,
    content,
    author: author || req.admin?._id,
    tags: tags || [],
    img: img || "",
  });

  res.status(201).json({ success: true, blog: newBlog });
});

// ================= GET ALL BLOGS =================
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(200).json(blogs);
});

// ================= GET SINGLE BLOG =================
const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).json(blog);
});

// ================= UPDATE BLOG =================
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  Object.assign(blog, req.body);
  await blog.save();
  res.status(200).json({ success: true, blog });
});

// ================= DELETE BLOG =================
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

export { createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog };
