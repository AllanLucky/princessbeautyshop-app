import mongoose from "mongoose";
import slugify from "slugify";

/*
====================================================
 BLOG SCHEMA
====================================================
*/

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      default: "uncategorized",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
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
          required: true,
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

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
====================================================
 SAFE SLUG GENERATION
====================================================
*/

blogSchema.pre("validate", function () {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

/*
====================================================
 TEXT SEARCH INDEX
====================================================
*/

blogSchema.index({
  title: "text",
  content: "text",
  excerpt: "text",
});

/*
====================================================
 MODEL EXPORT ⭐
====================================================
*/

const Blog =
  mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;