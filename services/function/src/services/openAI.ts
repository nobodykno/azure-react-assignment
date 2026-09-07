
import OpenAI from 'openai';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

if (!endpoint) {
  throw new Error('AZURE_OPENAI_ENDPOINT is not configured');
}

if (!apiKey) {
  throw new Error('AZURE_OPENAI_API_KEY is not configured');
}

if (!deploymentName) {
  throw new Error(
    'AZURE_OPENAI_DEPLOYMENT_NAME is not configured',
  );
}

const client = new OpenAI({
  baseURL: `${endpoint.replace(/\/$/, '')}/openai/v1/`,
  apiKey,
});

/**
 * Sends a PDF document to Azure OpenAI for clinical information extraction.
 */
export const analyzeDocument = async (
  document: Buffer,
  filename: string,
): Promise<string> => {
  if (!document || document.length === 0) {
    throw new Error('Document is empty');
  }

  if (!filename) {
    throw new Error('Filename is required');
  }

  const base64Pdf = document.toString('base64');

  try {
    const response = await client.responses.create({
      model: deploymentName,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_file',
              filename,
              file_data: `data:application/pdf;base64,${base64Pdf}`,
            },
            {
              type: 'input_text',
              text: `
Analyze this clinical document.

Identify all supported clinical document types and extract their appropriate measures.

Supported document types:

1. Blood Pressure
   Document Type: BP

2. Hemoglobin A1c
   Document Type: A1C

Rules:

- Include the date when the report was generated

- If the document contains a Blood Pressure measurement such as:
  "Blood Pressure: 138/88 mmHg"
  return:
  {
    "documentType": "BP",
    "measure": "138/88",
    "measureDate":23/08/2026
  }

- If the document contains a Hemoglobin A1c measurement such as:
  "Hemoglobin A1c: 7.4%"
  return:
  {
    "documentType": "A1C",
    "measure": "7.4%",
    "measureDate":23/08/2026
  }

- If the document contains BOTH Blood Pressure and Hemoglobin A1c,
  return BOTH results.

- Do not invent values.
- Only return measurements that are actually present in the document.
- If neither supported measurement is present, return an empty array.

Return ONLY valid JSON in exactly this format:

{
  "results": [
    {
      "documentType": "BP",
      "measure": "138/88"
      "measureDate":23/08/2026
    },
    {
      "documentType": "A1C",
      "measure": "7.4%",
      "measureDate":23/08/2026
    }
  ]
}
`.trim()


            },
          ],
        },
      ],
    });

    const result = JSON.parse(response.output_text);

    return result;
  } catch (error) {
    console.error('Azure OpenAI document analysis failed:', error);

    throw new Error('Failed to analyze document with Azure OpenAI');
  }
};
