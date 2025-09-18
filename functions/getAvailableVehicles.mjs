/**
 * ○ Query Parameters:
■ capacityRequired: Number (e.g., ?capacityRequired=500)
■ fromPincode: String
■ toPincode: String
■ startTime: String (ISO Date format, e.g.,
2023-10-27T10:00:00Z) - The desired start time for the
booking.

 ○ Logic:
■ estimatedHours = estimatedRideDurationHours(fromPincode, toPincode)
■ endTime = startTime + estimatedHours
■ refer booking collection, find bookings B whose startTime and bookingEndTime
 do not overlap with input startTime and evaluated endTime, populate it with vehicleId
■ from B find out those with vehicleId.capacityKg >= capacityRequired
■ Response: 200 OK with an array of available vehicle
objects. Along with estimatedRideDurationHours: estimatedHours.
 */

import { Vehicle } from "../models/Vehicle.mjs";
import { calculateBookingEndTime, getUnavailableBookings } from "./bookingManagement.mjs";

export async function getAvailableVehicles(req, res) {
  const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
  const { endTime } = calculateBookingEndTime(
    fromPincode,
    toPincode,
    startTime
  );
  try {
    // const unavailableBookings = await getUnavailableBookings(startTime, endTime);
    const unavailableVehicleIds = await getUnavailableBookings(startTime, endTime);
    // extract vehicleId from bookings and combine it with estimatedRideDurationHours
    const suitableVehicles = await Vehicle.find({
      capacityKg: { $gte: capacityRequired },
      _id: { $nin: unavailableVehicleIds },
    });
    return res.status(200).json({ vehicles: suitableVehicles });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Internal server error" });
  }
}
