import azureMethods from 'azure_api/azure-storage'
 
export const downloadDocument = async (
  blobName: string,
): Promise<Buffer> => {
  const blobClient = azureMethods.blobContainerClient.getBlobClient(blobName);

  const exists = await blobClient.exists();

  if (!exists) {
    throw new Error(`Document not found: ${blobName}`);
  }

  return blobClient.downloadToBuffer();
};