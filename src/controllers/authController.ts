import { Request, Response } from "express";
import { authSchema } from "../utils/zodSchema";
import User from "../models/User";
import bcyrpt from "bcrypt";
import jwt from "jsonwebtoken";
import Wallet from "../models/Wallet";

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
        photoUrl: checkUser.photoUrl,
        token,
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

export const register = async (req: Request, res: Response) => {
  try {
    const parse = authSchema
      .omit({
        role: true,
      })
      .safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((error) => error.message);

      return res.status(400).json({
        status: "error",
        message: errorMessage,
        data: null,
      });
    }

    const emailExisted = await User.findOne({ email: parse.data.email });

    if (emailExisted) {
      return res.status(400).json({
        status: "error",
        message: "Email already exist",
        data: null,
      });
    }

    const hashPassword = bcyrpt.hashSync(parse.data.password, 12);
    const user = new User({
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      photo: req.file?.filename,
    });

    const wallet = new Wallet({ user: user._id, balance: 0 });

    await user.save();
    await wallet.save();

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        name: user.name,
        email: user.email,
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
