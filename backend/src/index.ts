import process from "process";
import express, { Express } from "express";
import dotenv from "dotenv";
import { connectionMongo} from "./config/connectionDB";
import router from "./routers";
import middleware from "./config/middleware";
import errorMiddleware from "./middlewares/error.middleware";
import "./config/firebaseAdmin";
// import { createClient } from "redis";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// export const redisClient = createClient();

// // Middleware
middleware(app);

// Database Connection
connectionMongo();

// Routes
app.use("/api/v1", router);

// // Error handling middleware
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server runing at http://localhost:${port}`);
});
