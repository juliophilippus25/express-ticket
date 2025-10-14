import express from "express";
import { getGenres } from "../../controllers/genreController";

const genreRouter = express.Router();

genreRouter.get("/", getGenres);

export default genreRouter;
