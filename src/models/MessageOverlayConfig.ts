import mongoose, { Schema, Document } from "mongoose";

export interface IMessageOverlayConfig extends Document {
  userId: string;
  theme: string;
  messageFlow: string; // 'up' or 'down'
  showUserMessage: boolean;
  showGatewayBadge: boolean;
  showBoxTitle: boolean;
  emptyTipMessage: string;
  numberOfTips: number;
  pageConfig: {
    pageColor: string;
    pageOpacity: number;
  };
  fontConfig: {
    fontFamily: string;
    tipperFontWeight: number;
    tipperFontSize: number;
    amountFontWeight: number;
    amountFontSize: number;
  };
  colorConfig: {
    amountTextColor: string;
    tipperTextColor: string;
    userMessageColor: string;
    gatewayBadgeColor: string;
  };
  boxItemConfig: {
    backgroundColor: string;
    backgroundOpacity: number;
    borderRadius: number;
  };
}

const MessageOverlayConfigSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    theme: { type: String, default: "Custom" },
    messageFlow: { type: String, default: "down" },
    showUserMessage: { type: Boolean, default: true },
    showGatewayBadge: { type: Boolean, default: true },
    showBoxTitle: { type: Boolean, default: false },
    emptyTipMessage: { type: String, default: "No tips received yet. Be the first to tip!" },
    numberOfTips: { type: Number, default: 3 },
    pageConfig: {
      pageColor: { type: String, default: "#ffffff" },
      pageOpacity: { type: Number, default: 0 },
    },
    fontConfig: {
      fontFamily: { type: String, default: "Poppins" },
      tipperFontWeight: { type: Number, default: 600 },
      tipperFontSize: { type: Number, default: 16 },
      amountFontWeight: { type: Number, default: 800 },
      amountFontSize: { type: Number, default: 18 },
    },
    colorConfig: {
      amountTextColor: { type: String, default: "#ffd300" },
      tipperTextColor: { type: String, default: "#ffffff" },
      userMessageColor: { type: String, default: "#cfcfcf" },
      gatewayBadgeColor: { type: String, default: "#e21b4d" },
    },
    boxItemConfig: {
      backgroundColor: { type: String, default: "#00205b" },
      backgroundOpacity: { type: Number, default: 85 },
      borderRadius: { type: Number, default: 16 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.MessageOverlayConfig ||
  mongoose.model<IMessageOverlayConfig>("MessageOverlayConfig", MessageOverlayConfigSchema);
