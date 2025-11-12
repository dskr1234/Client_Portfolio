import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    contentHtml: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
