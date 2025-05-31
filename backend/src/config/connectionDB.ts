import mongoose from "mongoose";

export const connectionMongo = () => {
  return mongoose.connect(process.env.MONGODB_URL, { autoIndex: true });
};
