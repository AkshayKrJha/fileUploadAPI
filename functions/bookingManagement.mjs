/**
 * Calculate estimatedRideDurationHours based on
pincodes.
 Calculate bookingEndTime = startTime +
estimatedRideDurationHours.

● Ride Duration Calculation:
○ For simplicity, use the formula: estimatedRideDurationHours
= Math.abs(parseInt(toPincode) - parseInt(fromPincode)) %
24 (Take the absolute difference of pincode numbers, modulo
24 to keep it within a day - treat this as hours).
 */

import { Booking } from "../models/Booking.mjs";

export function estimatedRideDurationHours(fromPincode, toPincode) {
  return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
}

export function calculateBookingEndTime(fromPincode, toPincode, startTime) {
  const estimatedHours = estimatedRideDurationHours(fromPincode, toPincode);
  const start = new Date(startTime);
  const end = new Date(start.getTime() + estimatedHours * 60 * 60 * 1000);
  return {endTime: end.toISOString(), estimatedRideDurationHours: estimatedHours};
}

/**
 * another function to check overlapping time slots in Booking collection
 */

export async function isBookingAvailable(startTime, bookingEndTime) {
  const start = new Date(startTime);
  const end = new Date(bookingEndTime);
  const booking = await Booking.findOne({
    $or: [
      {
        startTime: { $lt: end, $gte: start },
      },
      {
        bookingEndTime: { $gt: start, $lte: end },
      },
      { startTime: { $lte: start }, bookingEndTime: { $gte: end } },
    ],
  });
  return !booking;
}

/**
 * another function to list all available bookings populated with vehicleId
 */

export async function getUnavailableBookings(startTime, bookingEndTime) {
  const start = new Date(startTime);
  const end = new Date(bookingEndTime);
  const bookings = await Booking.find({
    $or: [
      {
        startTime: { $lt: end, $gte: start },
      },
      {
        bookingEndTime: { $gt: start, $lte: end },
      },
      { startTime: { $lte: start }, bookingEndTime: { $gte: end } },
    ],
  // }).populate('vehicleId');
  }).select('vehicleId');
  // return bookings;
  return bookings.map(b => b.vehicleId);
}
