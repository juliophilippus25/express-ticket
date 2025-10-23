import express from "express";
import {
  getAvailableSeats,
  getGenres,
  getMovieDetail,
  getMovies,
  getMoviesFilter,
} from "../../controllers/globalController";
import { validateRequest } from "../../middlewares/validateRequest";
import { transactionSchema } from "../../utils/zodSchema";
import {
  getOrderDetail,
  getOrders,
  transactionBookTicket,
} from "../../controllers/ticketController";

const globalRouter = express.Router();

globalRouter.get("/movies", getMovies);
globalRouter.get("/genres", getGenres);
globalRouter.get("/movies/:id", getMovieDetail);
globalRouter.get("/check-seats/:movieId", getAvailableSeats);
globalRouter.get("/browse-movies/:genreId", getMoviesFilter);
globalRouter.post(
  "/transaction/book-ticket",
  validateRequest(transactionSchema),
  transactionBookTicket
);
globalRouter.get("/orders", getOrders);
globalRouter.get("/orders/:id", getOrderDetail);

export default globalRouter;
