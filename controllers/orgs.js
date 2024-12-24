import { Review } from "../models/reviews.js";
import { getOrganizations, tryCatch } from "../utils/utils.js";

export const getOrgs = tryCatch(async (req, res, next) => {

    const reviews = await Review.aggregate([
        {
            $group: {
                _id: "$orgName",
                reviewCount: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);

    const reviewMap = new Map();
    reviews.forEach((review) => {
        reviewMap.set(review._id, {
            reviewCount: review.reviewCount,
            avgRating: review.avgRating,
        });
    });

    const result = getOrganizations().map((org) => {
        const reviewStats = reviewMap.get(org.name) || { reviewCount: 0, avgRating: 0 };
        return {
            ...org,
            ...reviewStats
        };
    });

    res.status(200).json(result);
})