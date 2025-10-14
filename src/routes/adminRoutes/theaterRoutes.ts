import express from "express";
import { getTheaters } from "../../controllers/theaterController";

const theaterRouter = express.Router();

theaterRouter.get("/", getTheaters);

export default theaterRouter;
