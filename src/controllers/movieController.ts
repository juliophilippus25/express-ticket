import { Request, Response } from "express";
import Movie from "../models/Movie";
import { movieSchema } from "../utils/zodSchema";
import { title } from "process";
import { error } from "console";

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find()
      .populate({
        path: "genre",
        select: "name",
      })
      .populate({
        path: "theaters",
        select: "name",
      });

    res.status(200).json({
      status: "success",
      message: "Movies retrieved successfully",
      data: {
        movies,
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

export const createMovie = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
        data: null,
      });
    }

    const parse = movieSchema.safeParse({
      title: req.body.title,
      genre: req.body.genre,
      theaters: req.body.theaters.split(","),
      price: Number.parseInt(req.body.price),
      available: req.body.available === "1" ? true : false,
      description: req.body.description,
      bonus: req.body?.bonus,
    });

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((error) => error.message);

      return res.status(400).json({
        status: "error",
        message: errorMessage,
        data: null,
      });
    }

    const movie = new Movie({
      title: parse.data.title,
      genre: parse.data.genre,
      theaters: parse.data.theaters,
      price: parse.data.price,
      available: parse.data.available,
      description: parse.data.description,
      bonus: parse.data.bonus,
      thumbnail: req.file?.filename,
    });

    await movie.save();

    res.status(201).json({
      status: "success",
      message: "Movie created successfully",
      data: {
        movie,
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
