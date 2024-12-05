import express from "express";
import { config } from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
config();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.get("/", (_, res) => {
    res.send("Server is working");
});

app.use(errorMiddleware);

export default app;
