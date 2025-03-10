import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(cookieParser());

const getAController = async (req: Request, res: Response) => {
  res.json({
    message: "Chat app is running...",
  });
};

app.get("/", getAController);

export default app;
