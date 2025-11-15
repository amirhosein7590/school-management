import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  expTime: { type: Number, required: true },
});

const otpModel = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default otpModel;
