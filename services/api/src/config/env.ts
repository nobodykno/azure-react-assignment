import dotenv from 'dotenv';


import { AppError } from '../middleware/app-error.js';




/**
 * Loads environment specific configuration
 */
import path from "node:path";


const environment = process.env.NODE_ENV || "development";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env." + environment),
});



const requiredEnv = ['PORT', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {


    throw new AppError(
      "Env missing",
      500,
    );
    // throw new Error(`Environment variable ${key} is missing.`);
  }
});

console.log(`Running in ${environment} mode`);

export default environment;
