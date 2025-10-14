import { Request, Response } from "express";
import Genre from "../models/Genre";

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find();

    res.status(200).json({
      status: "success",
      message: "Genres retrieved successfully",
      data: {
        genres,
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
