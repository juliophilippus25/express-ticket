import express from "express";
import genreRoutes from "./genreRoutes";

const adminRouter = express.Router();

adminRouter.use("/genres", genreRoutes);

export default adminRouter;
