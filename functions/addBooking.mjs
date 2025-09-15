/**
 * Request Body: { "vehicleId": "...", "fromPincode": "...",
"toPincode": "...", "startTime": "...", "customerId": "..." }

scan vehicle collection and give 404 Not Found if the vehicle ID doesn't exist.

find bookingEndTime from calculateBookingEndTime function

after calculating end Time, scan booking collection to check
if any document of Booking collection has startTime or bookingEndTime
in between the input startTime and calculated bookingEndTime

if yes, return 409 Conflict (or similar error) if the vehicle is already
booked for an overlapping time slot.
if no, create the booking, and give 201 Created with the created booking object if successful.
 */

import { Booking } from "../models/Booking.mjs";
import { Vehicle } from "../models/Vehicle.mjs";
import {
  calculateBookingEndTime,
  isBookingAvailable,
} from "./bookingManagement.mjs";
import mongoose from "mongoose";

export async function addBooking(req, res) {
  const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    const { endTime: bookingEndTime, estimatedRideDurationHours } =
      calculateBookingEndTime(fromPincode, toPincode, startTime);

    if (!(await isBookingAvailable(startTime, bookingEndTime))) {
      return res
        .status(409)
        .json({ error: "Vehicle is already booked for the given time slot" });
    }

    const booking = new Booking({
      // vehicleId: mongoose.Types.ObjectId(vehicleId),
      vehicleId,
      fromPincode,
      toPincode,
      startTime,
      bookingEndTime,
      estimatedRideDurationHours,
      customerId,
    });

    await booking.save();
    return res
      .status(201)
      .json({ message: "Booking created successfully", booking });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Internal server error" });
  }
}
