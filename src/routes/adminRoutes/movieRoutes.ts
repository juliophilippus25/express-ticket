import express from "express";
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieDetail,
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
movieRouter.delete("/:id", deleteMovie);
movieRouter.get("/:id", getMovieDetail);

export default movieRouter;
