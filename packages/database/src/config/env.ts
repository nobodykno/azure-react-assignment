import dotenv from "dotenv";
import path from "node:path";

const nodeEnv = process.env.NODE_ENV ?? "development";
const envFile = `.env.${nodeEnv}`;


console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
});

const envPath = path.resolve(process.cwd(), "../../", envFile);


const result = dotenv.config({
  path: envPath,
});

