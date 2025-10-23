import { Response } from "express";
import { CustomRequest } from "../types/Request";
import { transactionSchema } from "../utils/zodSchema";
import Wallet from "../models/Wallet";
import Transaction from "../models/Transaction";
import TransactionSeat from "../models/TransactionSeat";

export const transactionBookTicket = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const parse = transactionSchema.parse(req.body);

    const wallet = await Wallet.findOne({ user: req.user?.id });

    if (!wallet || (wallet && wallet.balance < parse.grandTotal)) {
      return res.status(400).json({
        status: "error",
        message: "Insufficient balance",
        data: null,
      });
    }

    const transaction = new Transaction({
      bookingFee: parse.bookingFee,
      bookingDate: parse.bookingDate,
      tax: parse.tax,
      subtotal: parse.subTotal,
      grandTotal: parse.grandTotal,
      user: req.user?.id,
      theater: parse.theaterId,
      movie: parse.movieId,
    });

    for (const seat of parse.seats) {
      const newSeat = new TransactionSeat({
        transaction: transaction.id,
        seat: seat,
      });

      await newSeat.save();
    }

    const transactionSeats = await TransactionSeat.find({
      transaction: transaction.id,
    });

    transaction.seats = transactionSeats.map((seat) => seat._id);

    const currentBalance = wallet.balance;

    await Wallet.findByIdAndUpdate(wallet.id, {
      balance: currentBalance - parse.grandTotal,
    });

    await transaction.save();

    return res.status(200).json({
      status: "success",
      message: "Ticket transaction created successfully",
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
