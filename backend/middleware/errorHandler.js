import { isProd } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, _res, next) =>
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));

export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof ApiError) return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message } });
    
    if (err.name === "CastError") {
        return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Invalid id" } });
    }

    console.error(err);
    return res.status(500).json({
        success: false,
        error: { code: "INTERNAL_ERROR", message: isProd ? "Something went wrong" : err.message },
    });
};