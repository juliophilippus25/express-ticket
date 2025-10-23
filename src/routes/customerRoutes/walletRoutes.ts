import express from "express";
import {
  getBalance,
  getTopUpHistory,
  topUpBalance,
} from "../../controllers/walletController";
import { validateRequest } from "../../middlewares/validateRequest";
import { topUpSchema } from "../../utils/zodSchema";

const walletRouter = express.Router();

walletRouter.get("/check-balance", getBalance);
walletRouter.get("/topup-history", getTopUpHistory);
walletRouter.post("/topup-balance", validateRequest(topUpSchema), topUpBalance);

export default walletRouter;
