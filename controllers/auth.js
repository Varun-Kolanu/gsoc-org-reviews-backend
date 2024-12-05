import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../middlewares/error.js";
import { tryCatch } from "../utils/utils.js";
import { sendJwt } from "../utils/sendJwt.js";

export const signup = tryCatch(async (req, res, next) => {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User already exists", 400));
    const hashedPwd = await bcrypt.hash(password, 10);
    user = await User.create({ username, email, password: hashedPwd });
    sendJwt(user, res, "You have signed up successfully", 201);
});

export const login = tryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("User does not exists", 404));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Invalid email or password"));
    sendJwt(user, res, `Welcome back ${user.username}`, 200);
});

export const myInfo = tryCatch(async (req, res) => {
    res.status(200).json(req.user)
});