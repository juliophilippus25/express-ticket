import express from "express";
import {
  getBalance,
  getTopUpHistory,
} from "../../controllers/walletController";

const walletRouter = express.Router();

walletRouter.get("/check-balance", getBalance);
walletRouter.get("/topup-history", getTopUpHistory);

export default walletRouter;
