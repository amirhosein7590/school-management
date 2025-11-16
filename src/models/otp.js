import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  expTime: { type: Number, required: true },
  resetToken: { type: String, required: false, default: null },
  resetTokenExp: { type: Number, required: false, default: null },
});

const otpModel = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default otpModel;
