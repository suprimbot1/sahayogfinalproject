import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: string;
  username: string; // The URL handle e.g. cr8.rs/username
  coverImage?: string;
  profileImage?: string;
  about?: string;
  slogan?: string;
  settings: {
    latestSupportersCount: number;
    minTipAmount: number;
    maxMessageLength: number;
    profanityFilterEnabled: boolean;
    customBadWords: string[];
  };
  socialLinks: { platform: string; url: string }[];
  bioLinks: { title: string; url: string; active: boolean; icon?: string }[];
}

const UserProfileSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    coverImage: { type: String },
    profileImage: { type: String },
    about: { type: String },
    slogan: { type: String },
    settings: {
      latestSupportersCount: { type: Number, default: 10 },
      minTipAmount: { type: Number, default: 50 },
      maxMessageLength: { type: Number, default: 99 },
      profanityFilterEnabled: { type: Boolean, default: false },
      customBadWords: [{ type: String }],
    },
    socialLinks: [
      {
        platform: { type: String },
        url: { type: String },
      },
    ],
    bioLinks: [
      {
        title: { type: String },
        url: { type: String },
        active: { type: Boolean, default: true },
        icon: { type: String },
      },
    ],
    payoutDetails: {
      method: { type: String, enum: ["KHALTI", "BANK"], default: "KHALTI" },
      accountName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      isVerified: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Prevent mongoose from recompiling the model upon HMR in dev
export default mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
