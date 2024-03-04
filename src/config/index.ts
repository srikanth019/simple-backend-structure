import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV ?? "development"}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const { PORT, NODE_ENV, MONGO_URL } = process.env;
// export const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
export const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} = process.env;
export const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_CLOUD_KEY,
  CLOUDINARY_CLOUD_SECRET,
} = process.env;
