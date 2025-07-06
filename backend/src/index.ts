import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";

import "./utils/scheduler";
import slackRoutes from "./routes/slack"; 
import authRoutes from "./routes/auth";
import messageRoutes from "./routes/message";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/slack", slackRoutes);

app.get("/", (_, res) => {
  res.send("Slack Connect Backend is running");
});


mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
