import { Request, Response } from "express";
import Genre from "../models/Genre";
import { genreSchema } from "../utils/zodSchema";

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

export const postGenre = async (req: Request, res: Response) => {
  try {
    const body = genreSchema.parse(req.body);

    const genre = new Genre({
      name: body.name,
    });

    const createdGenre = await genre.save();

    res.status(201).json({
      status: "success",
      message: "Genre created successfully",
      data: {
        genre: createdGenre,
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
