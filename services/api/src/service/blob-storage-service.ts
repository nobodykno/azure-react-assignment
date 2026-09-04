import { randomUUID } from 'node:crypto';
import type { Readable } from 'node:stream';
import azureMethods from '../config/azure-service.js';




export interface BlobUploadResult {
  blobName: string;
  originalName: string;
  mimeType: string;
}

export const uploadToBlobStorage = async (
  stream: Readable,
  originalName: string,
  mimeType: string,
): Promise<BlobUploadResult> => {
  await azureMethods.blobContainerClient.createIfNotExists();

  const extension = originalName.includes('.')
    ? originalName.substring(originalName.lastIndexOf('.'))
    : '';

  const blobName = `${randomUUID()}${extension}`;

  const blockBlobClient =
  azureMethods.blobContainerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadStream(
    stream,
    4 * 1024 * 1024,
    5,
    {
      blobHTTPHeaders: {
        blobContentType: mimeType,
      },
    },
  );

  return {
    blobName,
    originalName,
    mimeType,
  };
};