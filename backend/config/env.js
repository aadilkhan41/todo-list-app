const splitOrigins = (v) => (v || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  
export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 4000,
    MONGODB_URI: process.env.MONGODB_URI || "",
    CORS_ORIGIN: splitOrigins(process.env.CORS_ORIGIN),
};
  
if (!env.MONGODB_URI){
    throw new Error("MONGODB_URI is required");
}
  
export const isProd = env.NODE_ENV === "production";