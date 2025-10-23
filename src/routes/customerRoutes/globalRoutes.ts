import express from "express";
import {
  getAvailableSeats,
  getGenres,
  getMovieDetail,
  getMovies,
  getMoviesFilter,
} from "../../controllers/globalController";

const globalRouter = express.Router();

globalRouter.get("/movies", getMovies);
globalRouter.get("/genres", getGenres);
globalRouter.get("/movies/:id", getMovieDetail);
globalRouter.get("/check-seats/:movieId", getAvailableSeats);
globalRouter.get("/browse-movies/:genreId", getMoviesFilter);

export default globalRouter;
