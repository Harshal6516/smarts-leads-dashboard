import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";

import errorMiddleware from "./middlewares/errorMiddleware";
import leadRoutes from "./routes/lead.routes";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smarts-leads-dashboard-nine.vercel.app",
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

app.use("/api/leads", leadRoutes);

app.use(errorMiddleware);
export default app;