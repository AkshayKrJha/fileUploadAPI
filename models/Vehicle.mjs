// create  new mongoose model for  Vehicle with fields name, capacityKg, andtyres
import mongoose from "mongoose";
const vehicleSchema = new mongoose.Schema({
    name: {type: String, required: true},
    capacityKg: {type: Number, required: true},
    tyres: {type: [String], required: true}
});
export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
;