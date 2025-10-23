import { Request, Response } from "express";
import { CustomRequest } from "../types/Request";
import Wallet from "../models/Wallet";
import WalletTransaction from "../models/WalletTransaction";

export const getBalance = async (req: CustomRequest, res: Response) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user?.id });

    return res.status(200).json({
      status: "success",
      message: "Wallet balance retrieved successfully",
      data: {
        balance: wallet?.balance,
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

export const getTopUpHistory = async (req: CustomRequest, res: Response) => {
  try {
    const wallet = await Wallet.findOne({
      user: req.user?.id,
    });

    const data = await WalletTransaction.find({
      wallet: wallet?.id,
    }).select("wallet amount createdAt status");

    return res.status(200).json({
      status: "success",
      message: "Top up history retrieved successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
      data: null,
    });
  }
};
