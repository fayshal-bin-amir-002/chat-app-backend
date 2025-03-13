import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import path from "path";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://simple-chat-app-socketio.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
} else {
}

app.use("/api/v1", router);

const getAController = async (req: Request, res: Response) => {
  res.json({
    message: "Chat app is running...",
  });
};

app.get("/", getAController);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
