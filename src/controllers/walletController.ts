import { Request, Response } from "express";
import { CustomRequest } from "../types/Request";
import Wallet from "../models/Wallet";
import WalletTransaction from "../models/WalletTransaction";
import { topUpSchema } from "../utils/zodSchema";

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
    console.log(error);
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
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

export const topUpBalance = async (req: CustomRequest, res: Response) => {
  try {
    const parse = topUpSchema.parse(req.body);

    const midtransUrl = process.env.MIDTRANS_TRANSACTION_URL ?? "";
    const midtransAuth = process.env.MIDTRANS_AUTH_STRING ?? "";

    const wallet = await Wallet.findOne({ user: req.user?.id });

    const topUp = new WalletTransaction({
      wallet: wallet?.id,
      amount: parse.amount,
      status: "pending",
    });

    const midtransRequest = new Request(midtransUrl, {
      method: "POST",
      body: JSON.stringify({
        transaction_details: {
          order_id: topUp.id,
          gross_amount: topUp.amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: req.user?.email,
        },
        callbacks: {
          finish: process.env.SUCCES_PAYMENT_REDIRECT,
        },
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${midtransAuth}`,
      },
    });

    const midtransResponse = await fetch(midtransRequest);
    const midtransJson = await midtransResponse.json();

    await topUp.save();

    return res.status(200).json({
      status: "success",
      message: "Top up balance successfully",
      data: midtransJson,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
      data: null,
    });
  }
};
