import express from "express";
import {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  getGenreDetail,
} from "../../controllers/genreController";
import { validateRequest } from "../../middlewares/validateRequest";
import { genreSchema } from "../../utils/zodSchema";

const genreRouter = express.Router();

genreRouter.get("/", getGenres);
genreRouter.post("/", validateRequest(genreSchema), createGenre);
genreRouter.put("/:id", validateRequest(genreSchema), updateGenre);
genreRouter.delete("/:id", deleteGenre);
genreRouter.get("/:id", getGenreDetail);

export default genreRouter;
