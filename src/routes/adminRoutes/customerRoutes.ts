import express from "express";
import {
  getCustomers,
  getWalletTransactions,
} from "../../controllers/userController";

const customerRouter = express.Router();

customerRouter.get("/", getCustomers);
customerRouter.get("/wallet-transactions", getWalletTransactions);

export default customerRouter;
