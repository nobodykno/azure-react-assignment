
import environment from './env.js';
import validateEnv from './validate-env.js';
import azureMethods from './azure-service.js'

const config = {
  validateEnv,
  environment,
  azureMethods
};

export default config;
