// models/Blog.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    contentHtml: { type: String, required: true }, // rich HTML with <img src="...">
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
