import { frontendUrl } from "../config/constants.js";
import { User } from "../models/user.js";
import { tryCatch, userIsFromIITBhu } from "../utils/utils.js";
import jwt from "jsonwebtoken";

export const createGoogleUser = tryCatch(async (
    profile,
    cb
) => {
    let user = await User.findOne({ googleId: profile.id });
    const email = profile.emails[0].value;

    if (!user && userIsFromIITBhu(email)) {
        user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id
        });
    }
    return cb(null, profile);
});

export const googleCallback = tryCatch(async (user, req, res, next) => {
    let googleUser = await User.findOne({ googleId: user.id });

    if (!googleUser)
        res.redirect(`${frontendUrl}/login?error=not_from_iit_bhu`);
    else {
        const token = jwt.sign({ _id: googleUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.redirect(`${frontendUrl}?token=${token}`);
    }
});