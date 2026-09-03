import { BlobServiceClient } from '@azure/storage-blob';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error(
    'AZURE_STORAGE_CONNECTION_STRING is not configured',
  );
}

export const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

export const blobContainerName =
  process.env.AZURE_STORAGE_CONTAINER_NAME ?? 'clinical-report';

export const blobContainerClient =
  blobServiceClient.getContainerClient(blobContainerName);