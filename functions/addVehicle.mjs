import { Vehicle } from "../models/Vehicle.mjs";

export async function addVehicle(req, res) {
    // extract name, capacityKg, tyres from req.body
    const {name, capacityKg, tyres} = req.body;
    // save in vehicle collection with resounse code 201 on success
    try{
        const vehicle = new Vehicle({name, capacityKg, tyres});
        await vehicle.save();
        res.status(201).json({message: 'Vehicle added successfully', vehicle});
    }catch(e){
        res.status(500).json({error: 'Internal server error'});
    }
}