import dotenv from 'dotenv';


import { AppError } from '../middleware/app-error.js';




/**
 * Loads environment specific configuration
 */
import path from "node:path";


const environment = process.env.NODE_ENV || "development";
if (environment !== 'production') {
  dotenv.config({
    path: `../../.env.${environment}`,
  });
}


const requiredEnv = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

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
