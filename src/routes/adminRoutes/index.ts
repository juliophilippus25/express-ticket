import express from "express";
import genreRoutes from "./genreRoutes";
import theaterRoutes from "./theaterRoutes";
import movieRoutes from "./movieRoutes";
import customerRoutes from "./customerRoutes";
import { verifyRole, verifyToken } from "../../middlewares/verifyToken";

const adminRouter = express.Router();

adminRouter.use(verifyToken);
adminRouter.use(verifyRole("admin"));
adminRouter.use("/genres", genreRoutes);
adminRouter.use("/theaters", theaterRoutes);
adminRouter.use("/movies", movieRoutes);
adminRouter.use("/customers", customerRoutes);

export default adminRouter;
