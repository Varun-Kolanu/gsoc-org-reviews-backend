import express from "express";
import isAuthenticated from "../middlewares/auth.js";
import { deleteReview, getAllReviews, getReviews, postReview, updateReview } from "../controllers/reviews.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getAllReviews).post(isAuthenticated, postReview);
router.route("/:id").get(isAuthenticated, getReviews).delete(isAuthenticated, deleteReview).patch(isAuthenticated, updateReview);

export default router;