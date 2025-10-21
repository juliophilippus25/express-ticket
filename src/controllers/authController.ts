import { Request, Response } from "express";
import { authSchema } from "../utils/zodSchema";
import User from "../models/User";
import bcyrpt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const parse = authSchema
      .omit({
        name: true,
      })
      .parse(req.body);

    const checkUser = await User.findOne({
      email: parse.email,
      role: parse.role,
    });

    if (!checkUser) {
      return res.status(400).json({
        status: "error",
        message: "Email not registered",
        data: null,
      });
    }

    const comparePassword = bcyrpt.compareSync(
      parse.password,
      checkUser.password
    );

    if (!comparePassword) {
      return res.status(400).json({
        status: "error",
        message: "Email or password incorrect",
        data: null,
      });
    }

    const secretKey = process.env.SECRET_KEY as string;
    const token = jwt.sign(
      {
        id: checkUser._id,
      },
      secretKey,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        name: checkUser.name,
        email: checkUser.email,
        role: checkUser.role,
        photo: checkUser.photo,
        token,
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
