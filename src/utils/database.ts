import mongoose from "mongoose";

export default function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI ?? "";

  try {
    mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const dbConn = mongoose.connection;

  dbConn.once("open", () => {
    console.log(`MongoDB Connected: ${MONGODB_URI}`);
  });

  dbConn.on("error", (error) => {
    console.log("Connection Error: ", error);
  });
}
