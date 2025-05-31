import mongoose from "mongoose";
import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379", // Cấu hình ở đây
});

export const connectionMongo = () => {
  return mongoose.connect(process.env.MONGODB_URL, { autoIndex: true });
};

export const connectionRedis = () => {
  return redisClient.connect();
};
