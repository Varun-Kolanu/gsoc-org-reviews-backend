import express from "express";
import { googleCallback, googleUrl, myInfo } from "../controllers/auth.js";
import isAuthenticated, { cbMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", isAuthenticated, myInfo)
router.get("/google", googleUrl);

router.get(
    "/google/callback", cbMiddleware, async (req, res, next) => {
        googleCallback(req.user, req, res, next);
    }
);

export default router;