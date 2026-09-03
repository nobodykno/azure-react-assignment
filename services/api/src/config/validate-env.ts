/**
 * Validates all required environment variables.
 *
 * Throws an error if any required variable is missing.
 */
const validateEnv = (): void => {
  const requiredEnv = ['JWT_SECRET', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};

export default validateEnv;
