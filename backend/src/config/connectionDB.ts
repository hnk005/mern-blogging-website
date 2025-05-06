import mongoose from "mongoose";

export const connectionDB = () => {
  return mongoose.connect(process.env.MONGODB_URI, { autoIndex: true });
};
