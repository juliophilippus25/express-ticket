import { Request, Response } from "express";
import User from "../models/User";
import WalletTransaction from "../models/WalletTransaction";
import Transaction from "../models/Transaction";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "customer" }).select("name email");

    res.status(200).json({
      status: "success",
      message: "Customers retrieved successfully",
      data: {
        users,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

export const getWalletTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await WalletTransaction.find().populate({
      path: "wallet",
      select: "user -_id",
      populate: {
        path: "user",
        select: "name",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Wallet transactions retrieved successfully",
      data: {
        transactions,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

export const getTicketTransactions = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.find()
      .populate({
        path: "user",
        select: "name -_id",
      })
      .populate({
        path: "movie",
        select: "title -_id",
      })
      .populate({
        path: "theater",
        select: "name -_id",
      });

    return res.status(200).json({
      status: "success",
      message: "Ticket transactions retrieved successfully",
      data: {
        transaction,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
      data: null,
    });
  }
};
