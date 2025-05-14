import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prayerRoutes from "./routes/prayerRoutes";

dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/demo", prayerRoutes);

// Port
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
