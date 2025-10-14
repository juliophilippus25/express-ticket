import express from "express";
import { getGenres, postGenre } from "../../controllers/genreController";
import { validateRequest } from "../../middlewares/validateRequest";
import { genreSchema } from "../../utils/zodSchema";

const genreRouter = express.Router();

genreRouter.get("/", getGenres);
genreRouter.post("/", validateRequest(genreSchema), postGenre);

export default genreRouter;
