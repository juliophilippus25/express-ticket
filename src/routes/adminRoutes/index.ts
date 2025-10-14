import express from "express";
import genreRoutes from "./genreRoutes";
import theaterRoutes from "./theaterRoutes";

const adminRouter = express.Router();

adminRouter.use("/genres", genreRoutes);
adminRouter.use("/theaters", theaterRoutes);

export default adminRouter;
