import { Router } from "express";
import mongoose from "mongoose";

export function createApiRouter() {
    const router = Router();

    router.get("/health", (_req, res) => {
        const dbUp = mongoose.connection.readyState === 1;
        res.status(dbUp ? 200 : 503).json({
        success: dbUp,
            data: { status: dbUp ? "ok" : "degraded", db: dbUp ? "connected" : "disconnected", uptime: process.uptime() },
        });
    });

    return router;
}