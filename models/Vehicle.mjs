// create  new mongoose model for  Vehicle with fields name, capacityKg, andtyres
import mongoose from "mongoose";
const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    // alphbetical + space
    pattern: /^[A-Za-z\s]+$/,
  },
  capacityKg: {
    type: Number,
    required: true,
    validate: {
      // > 0
      validator: function (v) {
        return v > 0;
      },
      message: (props) =>
        `${props.value} is not a valid capacityKg! It must be greater than 0.`,
    },
  },
  // tyres: {type: [String], required: true}
  tyres: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: "Tyres must be an integer",
    },
  },
});
export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
