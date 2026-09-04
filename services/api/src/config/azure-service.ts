import { BlobServiceClient } from '@azure/storage-blob';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error(
    'AZURE_STORAGE_CONNECTION_STRING is not configured',
  );
}

 const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

 const blobContainerName =
  process.env.AZURE_STORAGE_CONTAINER_NAME ?? 'clinical-report';

 const blobContainerClient =
  blobServiceClient.getContainerClient(blobContainerName);

  const azureMethods = {
    blobContainerClient,
    blobServiceClient,
  }

  export default azureMethods;