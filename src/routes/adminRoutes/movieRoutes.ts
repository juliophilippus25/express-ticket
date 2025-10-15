import express from "express";
import {
  getMovies,
  createMovie,
  updateMovie,
} from "../../controllers/movieController";
import multer from "multer";
import { imageFilter, thumbnailStorage } from "../../utils/multer";

const movieRouter = express.Router();
const upload = multer({
  storage: thumbnailStorage(),
  fileFilter: imageFilter,
});

movieRouter.get("/", getMovies);
movieRouter.post("/", upload.single("thumbnail"), createMovie);
movieRouter.put("/:id", upload.single("thumbnail"), updateMovie);

export default movieRouter;
