import express from "express";
import passport from "passport";
import { googleCallback } from "../controllers/auth.js";
import { frontendUrl } from "../config/constants.js";

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${frontendUrl}/`,
        session: false,
    }),
    async (req, res, next) => {
        googleCallback(req.user, req, res, next);
    }
);

export default router;