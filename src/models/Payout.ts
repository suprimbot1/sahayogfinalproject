import mongoose, { Schema, Document } from "mongoose";

export interface IPayout extends Document {
  creatorId: string;
  amountNPR: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  processedAt?: Date;
  notes?: string;
  createdAt: Date;
}

const PayoutSchema: Schema = new Schema(
  {
    creatorId: { type: String, required: true },
    amountNPR: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "PROCESSING", "SUCCESS", "FAILED"], default: "PENDING" },
    payoutMethod: { type: String, enum: ["KHALTI", "BANK"], default: "KHALTI" },
    accountDetails: {
      name: { type: String, required: true },
      number: { type: String, required: true },
    },
    remarks: { type: String, default: "" },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Payout ||
  mongoose.model<IPayout>("Payout", PayoutSchema);
