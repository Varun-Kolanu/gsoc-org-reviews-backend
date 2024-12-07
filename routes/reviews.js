import express from "express";
import isAuthenticated from "../middlewares/auth.js";
import { deleteReview, getReviews, postReview, updateReview } from "../controllers/reviews.js";

const router = express.Router();

router.route("/").post(isAuthenticated, postReview);
router.route("/:id").get(isAuthenticated, getReviews).delete(isAuthenticated, deleteReview).patch(isAuthenticated, updateReview);

export default router;