import jwt from "jsonwebtoken";

export const sendJwt = async (
    user,
    res,
    message,
    statusCode,
) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "180m",
    });

    res.status(statusCode)
        .json({
            message,
            token
        });
};