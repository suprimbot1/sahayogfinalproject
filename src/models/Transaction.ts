import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  creatorId: string; // The ID of the user receiving the tip
  supporter: {
    name: string;
    email?: string;
  };
  financials: {
    amountNPR: number;
    platformFeeNPR: number;
    netAmountNPR: number;
  };
  message: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentMethod: "KHALTI" | "MOCK";
  referenceId?: string; // Khalti transaction/token ID
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    creatorId: { type: String, required: true },
    supporter: {
      name: { type: String, required: true },
      email: { type: String },
    },
    financials: {
      amountNPR: { type: Number, required: true },
      platformFeeNPR: { type: Number, default: 0 },
      netAmountNPR: { type: Number, required: true },
    },
    message: { type: String, default: "" },
    status: { type: String, enum: ["PENDING", "COMPLETED", "FAILED"], default: "PENDING" },
    paymentMethod: { type: String, enum: ["KHALTI", "MOCK"], default: "MOCK" },
    referenceId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
