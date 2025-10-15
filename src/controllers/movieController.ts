import { Request, Response } from "express";
import Movie from "../models/Movie";
import { movieSchema } from "../utils/zodSchema";
import path from "path";
import fs from "fs";
import Genre from "../models/Genre";
import Theater from "../models/Theater";

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

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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

    const oldMovie = await Movie.findById(id);

    if (!oldMovie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found",
        data: null,
      });
    }

    if (req.file) {
      const dirName = path.resolve();
      const filePath = path.join(
        dirName,
        "public/uploads/thumbnails",
        oldMovie.thumbnail
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Genre.findByIdAndUpdate(oldMovie.genre, {
      $pull: {
        movies: oldMovie._id,
      },
    });

    for (const theater of oldMovie.theaters) {
      await Theater.findByIdAndUpdate(theater._id, {
        $pull: {
          movies: oldMovie._id,
        },
      });
    }

    await Movie.findByIdAndUpdate(oldMovie._id, {
      title: parse.data.title,
      genre: parse.data.genre,
      theaters: parse.data.theaters,
      price: parse.data.price,
      available: parse.data.available,
      description: parse.data.description,
      bonus: parse.data.bonus,
      thumbnail: req?.file ? req.file.filename : oldMovie.thumbnail,
    });

    await Genre.findByIdAndUpdate(parse.data.genre, {
      $push: {
        movies: id,
      },
    });

    for (const theater of parse.data.theaters) {
      await Theater.findByIdAndUpdate(theater, {
        $push: {
          movies: id,
        },
      });
    }

    const updatedMovie = await Movie.findById(id);

    res.status(200).json({
      status: "success",
      message: "Movie updated successfully",
      data: {
        movie: updatedMovie,
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

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found",
        data: null,
      });
    }

    const dirName = path.resolve();
    const filePath = path.join(
      dirName,
      "public/uploads/thumbnails",
      movie.thumbnail
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Genre.findByIdAndUpdate(movie.genre, {
      $pull: {
        movies: movie._id,
      },
    });

    for (const theater of movie.theaters) {
      await Theater.findByIdAndUpdate(theater._id, {
        $pull: {
          movies: theater._id,
        },
      });
    }

    await Movie.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Movie deleted successfully",
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

export const getMovieDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id)
      .populate({
        path: "genre",
        select: "name",
      })
      .populate({
        path: "theaters",
        select: "name",
      });

    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found",
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Movie retrieved successfully",
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
