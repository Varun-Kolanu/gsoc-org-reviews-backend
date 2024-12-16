import ErrorHandler from "../middlewares/error.js";
import { Review } from "../models/reviews.js";
import { getOrganizations, tryCatch } from "../utils/utils.js";

export const getReviews = tryCatch(async (req, res, next) => {
    const orgName = req.params.id;
    const reviews = await Review.find({ orgName }).select("+user").populate("user", "name");
    let averageRating;
    if (reviews.length > 0) {
        averageRating = reviews
            .map(review => review.rating)
            .reduce((sum, rating) => sum + rating, 0) / reviews.length
    } else {
        averageRating = 0;
    }

    res.json({
        reviews,
        averageRating
    });
})

export const getAllReviews = tryCatch(async (req, res, next) => {
    let reviews = await Review.find().select("+user").populate("user", "name");
    res.json(reviews);
})

export const postReview = tryCatch(async (req, res, next) => {
    const { orgName, title, content, rating } = req.body;
    const org = getOrganizations().find(org => org.name === orgName);
    if (!org) {
        return next(new ErrorHandler("Organization not found", 404));
    }
    const rev = await Review.create({
        user: req.user._id,
        orgName,
        content,
        rating,
        title
    })
    res.status(201).json(rev);

});

export const deleteReview = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    if (req.user.role !== "admin") {
        const review = await Review.findById(id).select("+user");
        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }
        if (review.user.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler("Unauthorized to delete this review", 403));
        }
    }

    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Review deleted successfully" });
});

export const updateReview = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { title, content, rating } = req.body;
    let rev = await Review.findById(id).select("+user");
    if (!rev) {
        return next(new ErrorHandler("Review not found", 404));
    }

    if (rev.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Unauthorized to update this review", 403));
    }
    rev = await Review.findByIdAndUpdate(id, { title, content, rating }, { new: true }).select("+user").populate("user", "name");
    res.json(rev);
})