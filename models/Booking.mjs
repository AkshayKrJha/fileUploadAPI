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

const bookingSchema = new mongoose.Schema({
    vehicleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true},
    fromPincode: {type: String, required: true},
    toPincode: {type: String, required: true},
    startTime: {type: Date, required: true},
    bookingEndTime: {type: Date, required: true},
    estimatedRideDurationHours: {type: Number, required: true},
    customerId: {type: String, required: true}
});

export const Booking = mongoose.model('Booking', bookingSchema);