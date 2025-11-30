import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { z } from "zod";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  APP_PORT: z.string().transform((v) => parseInt(v, 10)),
  VITE_API_URL: z.url(),
});
export type Env = z.infer<typeof envSchema>;

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const rawEnv = loadEnv(mode, process.cwd(), "");
  const env = envSchema.parse(rawEnv);

  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: env.APP_PORT,
    },
  };
});
