import express from "express";
import { config } from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.js";
import reviewsRouter from "./routes/reviews.js";
import { errorMiddleware } from "./middlewares/error.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { createGoogleUser } from "./controllers/auth.js";
import { backendUrl } from "./config/constants.js";
import { getOrganizations, tryCatch } from "./utils/utils.js";

const app = express();
config();

app.use(cors());
app.use(express.json());

app.use(passport.initialize());
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${backendUrl}/api/v1/auth/google/callback`,
            scope: ["profile", "email"],
        },
        async function (accessToken, refreshToken, profile, cb) {
            return createGoogleUser(profile, cb);
        }
    )
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewsRouter);

app.get("/api/v1/orgs", tryCatch(async (req, res, next) => res.status(200).json(getOrganizations())))

app.get("/", (_, res) => {
    res.send("Server is working");
});

app.use(errorMiddleware);

export default app;
