import { Request, Response } from "express";
import Theater from "../models/Theater";
import { theaterSchema } from "../utils/zodSchema";

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

export const createTheater = async (req: Request, res: Response) => {
  try {
    const body = theaterSchema.parse(req.body);

    const theater = new Theater({
      name: body.name,
      city: body.city,
    });

    const createdTheater = await theater.save();

    res.status(201).json({
      status: "success",
      message: "Theater created successfully",
      data: {
        theater: createdTheater,
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
