import mongoose from "mongoose";
import { getAssetsUrl } from "../utils/helper";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    virtuals: {
      photoUrl: {
        get() {
          return `${getAssetsUrl("photos")}${this.photo}`;
        },
      },
    },
    toJson: {
      virtuals: true,
    },
  }
);

export default mongoose.model("User", userSchema, "users");
