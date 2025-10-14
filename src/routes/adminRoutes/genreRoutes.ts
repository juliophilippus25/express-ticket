import express from "express";
import {
  getGenres,
  createGenre,
  updateGenre,
} from "../../controllers/genreController";
import { validateRequest } from "../../middlewares/validateRequest";
import { genreSchema } from "../../utils/zodSchema";

const genreRouter = express.Router();

genreRouter.get("/", getGenres);
genreRouter.post("/", validateRequest(genreSchema), createGenre);
genreRouter.put("/:id", validateRequest(genreSchema), updateGenre);

export default genreRouter;
