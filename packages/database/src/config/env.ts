import dotenv from "dotenv";
import path from "node:path";

const nodeEnv = process.env.NODE_ENV ?? "development";
const envFile = `.env.${nodeEnv}`;

const envPath = path.resolve(process.cwd(), "../../", envFile);


const result = dotenv.config({
  path: envPath,
});

