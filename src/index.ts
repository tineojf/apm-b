import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import streakRoutes from "./routes/streakRoutes";
import profileRoutes from "./routes/profileRoutes";
import openaiRoutes from "./routes/openaiRoutes";
import bibleRoutes from "./routes/bibleRoutes";

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Welcome to the API, please use /api/v1/auth/register or /api/v1/auth/login",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/streak", streakRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/openai", openaiRoutes);
app.use("/api/v1/bible", bibleRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

// Vercel
export default app;

// Local server
// const PORT = Number(process.env.PORT) || 5000;

// app.listen(PORT, "0.0.0.0", () => {
// console.log(`Server running on port ${PORT}`);
// });
