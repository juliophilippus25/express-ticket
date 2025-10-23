import { Request, Response } from "express";
import Theater from "../models/Theater";
import { theaterSchema } from "../utils/zodSchema";

export const getTheaters = async (req: Request, res: Response) => {
  try {
    const theaters = await Theater.find();

    res.status(200).json({
      status: "success",
      message: "Theaters retrieved successfully",
      data: theaters,
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
      data: createdTheater,
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

export const getTheaterDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const theater = await Theater.findById(id);

    if (!theater) {
      return res.status(404).json({
        status: "error",
        message: "Theater not found",
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Theater retrieved successfully",
      data: theater,
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

export const updateTheater = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = theaterSchema.parse(req.body);

    const theater = await Theater.findByIdAndUpdate(id, {
      name: body.name,
      city: body.city,
    });

    if (!theater) {
      return res.status(404).json({
        status: "error",
        message: "Theater not found",
        data: null,
      });
    }

    const updatedTheater = await Theater.findById(id);

    res.status(200).json({
      status: "success",
      message: "Theater updated successfully",
      data: updatedTheater,
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

export const deleteTheater = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const theater = await Theater.findByIdAndDelete(id);

    if (!theater) {
      return res.status(404).json({
        status: "error",
        message: "Theater not found",
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Theater deleted successfully",
      data: theater,
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
