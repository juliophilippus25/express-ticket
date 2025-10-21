import express from "express";
import {
  getCustomers,
  getTicketTransactions,
  getWalletTransactions,
} from "../../controllers/userController";

const customerRouter = express.Router();

customerRouter.get("/", getCustomers);
customerRouter.get("/wallet-transactions", getWalletTransactions);
customerRouter.get("/ticket-transactions", getTicketTransactions);

export default customerRouter;
