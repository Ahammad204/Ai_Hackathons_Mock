import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default env;
