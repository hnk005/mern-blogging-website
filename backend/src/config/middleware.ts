import { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const middleware = (app: Express) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(cookieParser());
};

export default middleware;
