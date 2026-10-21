//import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

//config({ path: ".env" }); // drizzle-kit doesn't load .env by itself

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.ts",
    out: "./drizzle",
    dbCredentials: { url: process.env.DIRECT_URL! },
});