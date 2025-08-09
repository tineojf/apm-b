import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import streakRoutes from "./routes/streakRoutes";
import profileRoutes from "./routes/profileRoutes";
import openaiRoutes from "./routes/openaiRoutes";
import bibleRoutes from "./routes/bibleRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import friendsRoutes from "./routes/friends.route";

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API v2 is running",
    version: "2.0.0",
  });
});

app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/chat", chatRoutes);
app.use("/api/v2/streak", streakRoutes);
app.use("/api/v2/profile", profileRoutes);
app.use("/api/v2/openai", openaiRoutes);
app.use("/api/v2/bible", bibleRoutes);
app.use("/api/v2/feedback", feedbackRoutes);
app.use("/api/v1/friends", friendsRoutes);

// Vercel
export default app;

// Local server
// const PORT = Number(process.env.PORT) || 5000;

// app.listen(PORT, "0.0.0.0", () => {
// console.log(`Server running on port http://localhost:${process.env.PORT}`);
// });
