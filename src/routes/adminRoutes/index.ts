import express from "express";
import genreRoutes from "./genreRoutes";
import theaterRoutes from "./theaterRoutes";
import movieRoutes from "./movieRoutes";

const adminRouter = express.Router();

adminRouter.use("/genres", genreRoutes);
adminRouter.use("/theaters", theaterRoutes);
adminRouter.use("/movies", movieRoutes);

export default adminRouter;
