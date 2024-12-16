import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { frontendUrl } from "../config/constants.js";
import passport from "passport";

const isAuthenticated = async (req, _, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            return next(new ErrorHandler("Invalid JWT Token", 401))
        }

        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded._id);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid JWT Token", 401));
    }
}

export const cbMiddleware = (req, res, next) => {
    const state = JSON.parse(req.query.state || "{}");
    const frontend = state.frontendUrl || frontendUrl;
    const callBack = passport.authenticate("google", {
        failureRedirect: `${frontend}backend_redirect?error=unknown`,
        session: false,
    });
    req.frontendUrl = frontend;
    callBack(req, res, next);
}

export default isAuthenticated;