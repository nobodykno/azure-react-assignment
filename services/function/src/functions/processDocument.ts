
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';

import { downloadDocument } from '../services/blob-storage.js';
import { analyzeDocument } from '../services/openAI.js';
import dbObjects from 'azure-db';
import { validateClinicalResults } from '../services/clinical-validation-results.js';
import { extractDocumentText } from '../services/document-ocr.js';


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

    context.log(`Downloaded ${document.length} bytes`);

    const documentText = await extractDocumentText(document);

    context.log(`documentText ${documentText} bytes`);
    const result = await analyzeDocument(
      documentText,
      blobName,
    );

    const validation = validateClinicalResults(
      result.documentType,
      result.results,
    );

    context.log(
      'Clinical validation:',
      validation,
    );
    context.log('AI result:', result);

    // Extract BP and A1C results
    const bpResult = validation.results.find(
      (item) => item.documentType === 'BP',
    );

    const a1cResult = validation.results.find(
      (item) => item.documentType === 'A1C',
    );

    // Update existing file record
    const file = await dbObjects.model.File.findOne({
      where: {
        path: blobName,
      },
    });

    if (!file) {
      throw new Error(`File record not found for blob: ${blobName}`);
    }


    const status = validation.needsReview
    ? 'Needs Review'
    : 'Success';


    await file.update({
      bp_measure: bpResult?.measure ?? null,
      bp_measure_date: bpResult?.measureDate
        ? new Date(bpResult.measureDate)
        : null,

      a1c_measure: a1cResult?.measure ?? null,
      a1c_measure_date: a1cResult?.measureDate
        ? new Date(a1cResult.measureDate)
        : null,

      process_by: 'Azure Function',
      processing_date: new Date(),
      status
    });

    context.log(`File ${file.id} updated successfully`);

    return {
      status: 200,
      jsonBody: {
        success: true,
        blobName,
        status,
        result,
      },
    };
  } catch (error) {
    context.error('Failed to process document', error);

    // Try to update the file status to Failed
    try {
      const file = await dbObjects.model.File.findOne({
        where: {
          path: blobName,
        },
      });

      if (file) {
        await file.update({
          status: 'Failed',
          process_by: 'Azure Function',
          processing_date: new Date(),
        });

        context.log(`File ${file.id} marked as Failed`);
      }
    } catch (dbError) {
      context.error(
        'Failed to update file status',
        dbError,
      );
    }

    return {
      status: 500,
      jsonBody: {
        success: false,
        blobName,
        status: 'Failed',
        message: 'Failed to process document',
      },
    };
  }
}

app.http('processDocument', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: processDocument,
});

