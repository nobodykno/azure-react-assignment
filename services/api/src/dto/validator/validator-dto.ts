import type { z } from 'zod';

/**
 * DTO for zod validation
 */
export interface ValidationSchema {
  body?: z.ZodObject;
  params?: z.ZodObject;
  query?: z.ZodObject;
}
