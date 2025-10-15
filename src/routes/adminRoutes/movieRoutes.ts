import express from "express";
import { getMovies } from "../../controllers/movieController";

const movieRouter = express.Router();

movieRouter.get("/", getMovies);

export default movieRouter;
