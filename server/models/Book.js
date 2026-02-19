import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    semester: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    seller: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    condition: { type: String, enum: ["Like New", "Good", "Fair", "Acceptable"], required: true },
    status: { type: String, enum: ["available", "requested", "sold"], default: "available" },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    requestedByName: { type: String, default: null },
  },
  { timestamps: true }
);

// Virtual for id
bookSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.postedAt = obj.createdAt;
  if (obj.sellerId) obj.sellerId = obj.sellerId.toString();
  if (obj.requestedBy) obj.requestedBy = obj.requestedBy.toString();
  return obj;
};

const Book = mongoose.model("Book", bookSchema);
export default Book;
