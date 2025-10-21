import express from "express";
import { getCustomers } from "../../controllers/userController";

const customerRouter = express.Router();

customerRouter.get("/", getCustomers);

export default customerRouter;
