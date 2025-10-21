import { Request, Response } from "express";
import User from "../models/User";

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
