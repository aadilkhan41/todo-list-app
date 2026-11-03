import { connectDb, disconnectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { createApp } from "./createApp.js";

async function main() {
    await connectDb(env.MONGODB_URI);
    console.info("[db] connected");

    const server = createApp().listen(env.PORT, () => console.info(`[http] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`));

    const shutdown = (signal) => {
        server.close(async () => {
            await disconnectDb();
            process.exit(0);
        });
        setTimeout(() => process.exit(1), 10_000).unref();
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

main().catch((err) => {
    console.error("[fatal] failed to start", err);
    process.exit(1);
});