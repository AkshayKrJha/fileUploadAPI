import {Router} from "express";
import { vehicleRequestValidator } from "../middlewares/vehicleMiddleware.mjs";

const vehiclesRouter = Router();

vehiclesRouter.post("/", vehicleRequestValidator, async (req, res) => {
});

// post route to add a new vehicle