import { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const middleware = (app: Express) => {
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        "https://mern-blogging-website-vip3.onrender.com",
      ],
      credentials: true,
    })
  );
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(cookieParser());
};

export default middleware;
