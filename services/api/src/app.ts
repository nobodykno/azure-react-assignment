import cors from 'cors';
import express, { type Express } from 'express';
import 'azure-db/models';
import helmet from 'helmet';

import mainRoute from './route/main-route.js';
import corsOptions from './middleware/cors.js';
import globalRateLimiter from './middleware/rate-limiter.js';
import morganMiddleware from './middleware/morgan.js';
import globalErrorHandler from './middleware/global-error.js';


const app: Express = express();
app.set('trust proxy', 1);

app.use(cors());

app.use(express.json());

app.use(helmet());

if (process.env.NODE_ENV !== 'test') {
  app.use(globalRateLimiter);
}

app.use(morganMiddleware);
//Swagger doc



// Routes
app.use('/v1', mainRoute);



app.use(globalErrorHandler);

export default app;
