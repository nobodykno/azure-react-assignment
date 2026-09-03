

import { AppError } from './app-error.js';

import type cors from 'cors';

/**
 * Checks all allowedOrigins
 */
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') ?? [];
const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Allow Postman and server-to-server requests
    if (!origin) {
      return callback(null, true);
    }



    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }



    callback(
      new AppError("Cors error", 400),
    );
  },

  credentials: true,
};

export default corsOptions;
