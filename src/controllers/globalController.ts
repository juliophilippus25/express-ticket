import { Request, Response } from "express";
import Movie from "../models/Movie";
import Genre from "../models/Genre";
import Transaction from "../models/Transaction";
import Theater from "../models/Theater";

export const getMovies = async (req: Request, res: Response) => {
  try {
    const data = await Movie.find()
      .select("title thumbnail")
      .populate({
        path: "genre",
        select: "name -_id",
      })
      .limit(3);

    return res.status(200).json({
      status: "success",
      message: "Movies retrieved successfully",
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

export const getGenres = async (req: Request, res: Response) => {
  try {
    const data = await Genre.find().select("name").limit(3);

    return res.status(200).json({
      status: "success",
      message: "Genres retrieved successfully",
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

export const getMovieDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rows = ["A", "B", "C", "D", "E", "F"];
    const seatsPerRow = 6;

    const seats = rows.flatMap((row) =>
      Array.from({ length: seatsPerRow }, (_, i) => ({
        seat: `${row}${i + 1}`,
        isBooked: false,
      }))
    );

    const movie = await Movie.findById(id)
      .populate({
        path: "theaters",
        select: "name city",
      })
      .populate({
        path: "genre",
        select: "name -_id",
      });

    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Movie retrieved successfully",
      data: {
        movie: {
          ...movie.toJSON(),
          seats,
          times: [
            "10:00",
            "12:30",
            "15:00",
            "17:30",
            "19:30",
            "21:30",
            "22:00",
          ],
        },
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

export const getAvailableSeats = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    const transactions = await Transaction.find({
      date: date?.toString().replace("+", " "),
      movie: movieId,
    })
      .select("seats")
      .populate({
        path: "seats",
        select: "seat",
      });

    const seats = [];
    for (const seat of transactions) {
      seats.push(...seat.seats);
    }

    return res.status(200).json({
      status: "success",
      message: "Seats retrieved successfully",
      data: seats,
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

export const getMoviesFilter = async (req: Request, res: Response) => {
  try {
    const { genreId } = req.params;
    const { city, theaters, availbility } = req.query;

    let filterQuery: any = {};

    if (genreId) {
      filterQuery = { ...filterQuery, genre: genreId };
    }

    if (city) {
      const theatherList = await Theater.find({
        city: city,
      });

      const theaterIds = theatherList.map((theater) => theater._id);

      filterQuery = { ...filterQuery, theaters: { $in: theaterIds } };
    }

    if (theaters) {
      const theaterIds2 = theaters as string[];
      filterQuery = {
        ...filterQuery,
        theaters: {
          $in: [...(filterQuery?.theaters.$in ?? []), theaterIds2],
        },
      };
    }

    if (availbility === "true") {
      filterQuery = {
        ...filterQuery,
        available: true,
      };
    }

    const data = await Movie.find({
      ...filterQuery,
    })
      .select("title genre thumbnail")
      .populate({
        path: "genre",
        select: "name",
      });

    const allData = await Movie.find()
      .select("title genre theaters thumbnail")
      .populate({
        path: "genre",
        select: "name",
      })
      .populate({
        path: "theaters",
        select: "city",
      });

    return res.status(200).json({
      status: "success",
      message: "Filtered movies retrieved successfully",
      data: {
        filteredMovies: data,
        allMovies: allData,
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
