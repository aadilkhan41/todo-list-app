import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env, isProd } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { createApiRouter } from "./routes/index.js";

export function createApp() {
    const app = express();
    app.disable("x-powered-by");
    app.use(cors({ origin: env.CORS_ORIGIN }));
    app.use(express.json());
    app.use(morgan(isProd ? "combined" : "dev"));
    app.use("/api/v1", createApiRouter());
    app.use(notFound);
    app.use(errorHandler);
    return app;
}