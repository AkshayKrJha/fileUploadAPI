/**
 * Booking model has
 * vehicleId (ObjectId referencing Vehicle model),
 * fromPinCode (String),
 * toPinCode (String),
 * startTime (Date),
 * bookingEndTime (Date),
 * customerId (String),
 * estimatedRideDurationHours (Number)
 */

import mongoose from "mongoose";
import { calculateBookingEndTime } from "../functions/bookingManagement.mjs";

const bookingSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  fromPincode: { type: String, required: true },
  toPincode: { type: String, required: true },
  startTime: { type: Date, required: true },
  bookingEndTime: { type: Date },
  estimatedRideDurationHours: { type: Number },
  customerId: { type: String, required: true, default: "randomCustomer" },
});

// Pre-save hook to set calculated fields
bookingSchema.pre("save", function (next) {
  if (!this.estimatedRideDurationHours || !this.bookingEndTime) {
    const { endTime: bookingEndTime, estimatedRideDurationHours } =
      calculateBookingEndTime(this.fromPincode, this.toPincode, this.startTime);
    this.estimatedRideDurationHours = estimatedRideDurationHours;
    this.bookingEndTime = bookingEndTime;
  }
  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);
