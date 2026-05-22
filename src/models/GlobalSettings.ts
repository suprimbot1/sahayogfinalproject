import mongoose, { Schema, Document } from "mongoose";

export interface IGlobalSettings extends Document {
  platformName: string;
  supportEmail: string;
  commissionPercentage: number;
  minWithdrawalAmount: number;
  maintenanceMode: boolean;
  khaltiEnabled: boolean;
  bankTransferEnabled: boolean;
  updatedAt: Date;
}

const GlobalSettingsSchema: Schema = new Schema({
  platformName: { type: String, default: "Sahayog" },
  supportEmail: { type: String, default: "support@sahayog.app" },
  commissionPercentage: { type: Number, default: 10 },
  minWithdrawalAmount: { type: Number, default: 100 },
  maintenanceMode: { type: Boolean, default: false },
  khaltiEnabled: { type: Boolean, default: true },
  bankTransferEnabled: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.GlobalSettings || mongoose.model<IGlobalSettings>("GlobalSettings", GlobalSettingsSchema);
