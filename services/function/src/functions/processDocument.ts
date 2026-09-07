import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
  } from '@azure/functions';
  
  import { downloadDocument } from '../services/blob-storage.js';
import { analyzeDocument } from '../services/openAI.js';

  
  interface ProcessDocumentRequest {
    blobName: string;
  }
  
  export async function processDocument(
    request: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const body = (await request.json()) as ProcessDocumentRequest;
  
    const { blobName } = body;
  
    if (!blobName) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          message: 'blobName is required',
        },
      };
    }
  
    try {
      context.log(`Reading blob: ${blobName}`);
  
      const document = await downloadDocument(blobName);

      const result = await analyzeDocument(
        document,
        blobName,
      );
      
      context.log('AI result:', result);
  
      context.log(`Downloaded ${document.length} bytes`);
  
      return {
        status: 200,
        jsonBody: {
          success: true,
          blobName,
          result,
        },
      };
    } catch (error) {
      context.error('Failed to read document', error);
  
      return {
        status: 500,
        jsonBody: {
          success: false,
          message: 'Failed to read document',
        },
      };
    }
  }
  
  app.http('processDocument', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: processDocument,
  });