import express from "express";
import globalRoutes from "./globalRoutes";
import walletRoutes from "./walletRoutes";
import { verifyRole, verifyToken } from "../../middlewares/verifyToken";

const customerRouter = express.Router();

customerRouter.use(verifyToken);
customerRouter.use(verifyRole("customer"));
customerRouter.use(globalRoutes);
customerRouter.use("/wallet", walletRoutes);

export default customerRouter;
