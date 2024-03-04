import { connect, set } from "mongoose";

import { NODE_ENV, MONGO_URL } from "@config";

export const dbConnection = async () => {
  const dbConfig = {
    // url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    url: MONGO_URL || "mongodb://localhost:27017/dev",
  };

  if (NODE_ENV !== "production") {
    set("debug", true);
  }

  await connect(dbConfig.url)
    .then(() => {
      console.log("Database connection successful");
    })
    .catch((err) => {
      console.log(err);
      console.error("Database connection error");
    });
};
