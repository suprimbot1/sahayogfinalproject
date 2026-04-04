import mongoose, { Schema, Document } from "mongoose";

export interface IAlertConfig extends Document {
  userId: string;
  name: string;
  layout: "IMAGE_TOP" | "IMAGE_LEFT" | "IMAGE_RIGHT" | "IMAGE_CENTER";
  media: {
    imageUri?: string;
    soundUri?: string;
  };
  settings: {
    duration: number; // in seconds
    delay: number; // in seconds
    soundVolume: number; // 0-100
  };
  typography: {
    messageTemplate: string;
    fontSize: number;
    fontWeight: number;
    color: string;
  };
  animations: {
    inAnimation: string;
    outAnimation: string;
    textAnimation: string;
  };
  tts: {
    enabled: boolean;
    voice: string;
    volume: number;
  };
}

const AlertConfigSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, default: "Base" },
    layout: { type: String, enum: ["IMAGE_TOP", "IMAGE_LEFT", "IMAGE_RIGHT", "IMAGE_CENTER"], default: "IMAGE_TOP" },
    media: {
      imageUri: { type: String, default: "" },
      soundUri: { type: String, default: "" },
    },
    settings: {
      duration: { type: Number, default: 10 },
      delay: { type: Number, default: 4 },
      soundVolume: { type: Number, default: 80 },
    },
    typography: {
      messageTemplate: { type: String, default: "{tipper} tipped Rs.{amount}!!" },
      fontSize: { type: Number, default: 48 },
      fontWeight: { type: Number, default: 700 },
      color: { type: String, default: "#ffffff" },
    },
    animations: {
      inAnimation: { type: String, default: "SlideInTop" },
      outAnimation: { type: String, default: "SlideOutTop" },
      textAnimation: { type: String, default: "pulse" },
    },
    tts: {
      enabled: { type: Boolean, default: false },
      voice: { type: String, default: "Bengali Dai" },
      volume: { type: Number, default: 50 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.AlertConfig ||
  mongoose.model<IAlertConfig>("AlertConfig", AlertConfigSchema);
