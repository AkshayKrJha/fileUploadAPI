import {Router} from "express";
import { vehicleRequestValidator } from "../middlewares/vehicleMiddleware.mjs";
import { addVehicle } from "../functions/addVehicle.mjs";
import { getAvailableVehicles } from "../functions/getAvailableVehicles.mjs";

const vehiclesRouter = Router();

vehiclesRouter.post("/", vehicleRequestValidator, addVehicle);
vehiclesRouter.get("/available", getAvailableVehicles);

export default vehiclesRouter