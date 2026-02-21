import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    category: {
      type: String,
      trim: true,
      index: true,
      default: "uncategorized",
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        content: {
          type: String,
          required: true,
          trim: true,
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

/*
====================================================
 AUTO SLUG GENERATION
====================================================
*/

blogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});

/*
====================================================
 TEXT SEARCH INDEXING
====================================================
*/

blogSchema.index({
  title: "text",
  content: "text",
  excerpt: "text",
});

/*
====================================================
 MODEL EXPORT
====================================================
*/

const Blog =
  mongoose.models.Blog ||
  mongoose.model("Blog", blogSchema);

export default Blog;