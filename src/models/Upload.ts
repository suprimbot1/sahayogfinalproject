import mongoose, { Schema, Document } from "mongoose";

export interface IUpload extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  size: number;
  uploadedAt: Date;
}

const UploadSchema: Schema = new Schema(
  {
    filename: { type: String, required: true, unique: true, index: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent mongoose from recompiling the model upon HMR in dev
export default mongoose.models.Upload ||
  mongoose.model<IUpload>("Upload", UploadSchema);
