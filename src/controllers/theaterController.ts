import { Request, Response } from "express";
import Theater from "../models/Theater";

export const getTheaters = async (req: Request, res: Response) => {
  try {
    const theaters = await Theater.find();

    res.status(200).json({
      status: "success",
      message: "Theaters retrieved successfully",
      data: {
        theaters,
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
