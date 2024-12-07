import express from "express";
import passport from "passport";
import { googleCallback, myInfo } from "../controllers/auth.js";
import { frontendUrl } from "../config/constants.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", isAuthenticated, myInfo)
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${frontendUrl}/backend_redirect?error=unknown`,
        session: false,
    }),
    async (req, res, next) => {
        googleCallback(req.user, req, res, next);
    }
);

export default router;