import {Router} from "express";
import { addBooking } from "../functions/addBooking.mjs";

const bookingsRouter = Router();

bookingsRouter.post("/", addBooking)

export default bookingsRouter;

