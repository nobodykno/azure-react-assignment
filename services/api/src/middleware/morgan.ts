
import morgan from 'morgan';
/**
 * Custom Morgan stream that forwards HTTP request logs
 * to the application's Winston logger.
 */


const morganMiddleware =
  process.env.NODE_ENV === 'development'
    ? morgan('dev')
    : morgan(':method :url :status :response-time ms');

export default morganMiddleware;
