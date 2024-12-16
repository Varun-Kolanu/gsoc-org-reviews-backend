import passport from "passport";
import { User } from "../models/user.js";
import { tryCatch, userIsFromIITBhu } from "../utils/utils.js";
import jwt from "jsonwebtoken";

export const myInfo = tryCatch(async (req, res, next) => {
    res.status(200).json(req.user);
});

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

export const googleUrl = tryCatch(async (req, res, next) => {
    const frontendUrl = req.headers.referer;
    const state = JSON.stringify({ frontendUrl });
    const authUrl = passport.authenticate("google", {
        scope: ["profile", "email"],
        state,
    });

    authUrl(req, res, next);
});

export const googleCallback = tryCatch(async (user, req, res, next) => {
    const frontendUrl = req.frontendUrl;
    let googleUser = await User.findOne({ googleId: user.id });

    if (!googleUser)
        res.redirect(`${frontendUrl}backend_redirect?error=not_from_iit_bhu`);
    else {
        const token = jwt.sign({ _id: googleUser._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        res.redirect(`${frontendUrl}backend_redirect?token=${token}`);
    }
});