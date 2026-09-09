
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


interface AnalyzeDocumentResult {
  documentType: 'Clinical' | 'Other';
  results: {
    documentType: 'BP' | 'A1C';
    measure: string;
    measureDate: string;
  }[];
}

/**
 * Sends a PDF document to Azure OpenAI for clinical information extraction.
 */
export const analyzeDocument = async (
  document: string,
  filename: string,
): Promise<AnalyzeDocumentResult> => {
  if (!document || document.length === 0) {
    throw new Error('Document is empty');
  }

  if (!filename) {
    throw new Error('Filename is required');
  }



  try {
    const response = await client.responses.create({
      model: deploymentName,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Analyze this clinical document.

Filename: ${filename}

Document content:
${document}

              DOCUMENT CLASSIFICATION:
              
              Return one of the following document types:
              
              1. "Clinical"
                 Use this when the document contains patient medical information,
                 clinical measurements, laboratory results, vital signs, diagnoses,
                 medical reports, or other healthcare-related information.
              
              2. "Other"
                 Use this when the document is not a clinical or medical document.
              
              Examples of "Other" documents include:
              - Salary slips
              - Invoices
              - Bank statements
              - Resumes
              - Employment documents
              - Receipts
              - Financial documents
              - Administrative documents
              - Identity documents
              - General business documents
              
              IMPORTANT CLASSIFICATION RULES:
              
              - Do not classify a document as Clinical merely because it contains numbers.
              - Salary, financial, employment, administrative, and business documents must
                be classified as "Other".
              - If the document is clearly unrelated to healthcare, return "Other".
              - If the document is clearly a healthcare/medical document, return "Clinical".
              
              
              SUPPORTED CLINICAL MEASUREMENTS:
              
              If the document is "Clinical", extract the following supported measurements:
              
              1. Blood Pressure
                 documentType: "BP"
              
              2. Hemoglobin A1c
                 documentType: "A1C"
              
              Do not extract other clinical measurements.
              
              
              GENERAL EXTRACTION RULES:
              
              - Only extract measurements that are actually present in the document.
              - Do not invent, estimate, calculate, or infer a measurement that is not
                explicitly present.
              - Do not generate a measurement based on medical knowledge.
              - Do not generate a measurement based on what you believe the value should be.
              - Ignore reference ranges.
              - Ignore normal ranges.
              - Ignore educational information.
              - Ignore examples.
              - Ignore goals.
              - Ignore targets.
              - Ignore recommended values.
              - Ignore expected values.
              - Ignore template/example values.
              - Ignore historical or previous measurements when determining the current result.
              - Only return actual patient measurements.
              - Include the date associated with the selected measurement when available.
              - Return dates in YYYY-MM-DD format.
              - If the date cannot be determined, return an empty string.
              - If a measurement does not satisfy the validation rules below, do not return it.
              - Do not return duplicate results for the same document type.
              - Return at most one BP result and one A1C result.
              
              
              BLOOD PRESSURE VALIDATION:
              
              A valid blood pressure must contain BOTH:
              
              - Systolic value
              - Diastolic value
              
              Example:
              
              "138/88 mmHg"
              
              The extracted measure should be returned as:
              
              "138/88"
              
              Rules:
              
              - Do not return systolic-only values.
              - Do not return diastolic-only values.
              - Do not return blood pressure goals.
              - Do not return blood pressure targets.
              - Do not return recommended blood pressure values.
              - Do not return reference blood pressure values.
              - Do not return example blood pressure values.
              - Do not return previous blood pressure readings.
              - Do not return historical blood pressure readings.
              - Do not return values explicitly identified as past, previous, historical,
                old, or prior readings.
              - If the patient age is explicitly available and the patient is younger than
                18 years old, do not return a BP result.
              - Only return an actual patient BP measurement.
              
              MULTIPLE BLOOD PRESSURE READINGS:
              
              If multiple valid current BP readings exist:
              
              1. Prefer the most recent valid BP reading when the measurement date or time
                 can be determined.
              
              2. If the dates/times cannot be used to determine which reading is most recent,
                 select the BP with the lowest:
              
                 systolic + diastolic
              
              Example:
              
              BP 140/90 -> 230
              BP 130/80 -> 210
              BP 135/85 -> 220
              
              Select:
              
              130/80
              
              Do not return multiple BP results.
              
              If it is impossible to determine which BP satisfies the selection rules,
              do not guess. Return no BP result.
              
              
              HEMOGLOBIN A1C VALIDATION:
              
              Extract only actual HbA1c measurements.
              
              Valid examples:
              
              "5.7%"
              "6.2%"
              "HbA1c: 6.2%"
              "A1c 5.8%"
              
              Ignore:
              
              - HbA1c goals
              - HbA1c targets
              - HbA1c reference ranges
              - HbA1c normal ranges
              - Educational examples
              - Historical HbA1c values
              - Previous HbA1c values
              - Recommended HbA1c values
              - Example patient values
              
              Only extract the patient's actual HbA1c result.
              
              MULTIPLE HbA1c VALUES:
              
              If multiple valid HbA1c measurements exist:
              
              - Select the LOWEST valid HbA1c value.
              - Do not return multiple A1C results.
              
              Example:
              
              5.8%
              6.2%
              5.6%
              
              Select:
              
              5.6%
              
              
              HbA1c CLASSIFICATION:
              
              After selecting the valid HbA1c value:
              
              - If HbA1c is greater than 5.9%, classify it as "Diabetes".
              - If HbA1c is greater than 5.7% and less than or equal to 5.9%,
                classify it as "PreDibatic".
              - If HbA1c is 5.7% or below, do not add a diabetes or preDibatic
                classification.
              
              Examples:
              
              5.6% -> "5.6%"
              5.7% -> "5.7%"
              5.8% -> "5.8% (PreDibatic)"
              5.9% -> "5.9% (PreDibatic)"
              6.0% -> "6.0% (Diabetes)"
              6.2% -> "6.2% (Diabetes)"
              7.1% -> "7.1% (Diabetes)"
              
              
              DATE RULES:
              
              - Return the date associated with the selected measurement.
              - Use the measurement date when available.
              - Do not use an unrelated document date when a measurement-specific date is
                available.
              - Return dates only in YYYY-MM-DD format.
              - If no reliable measurement date is available, return an empty string.
              - Do not invent a date.
              
              
              CLINICAL DOCUMENT WITH NO SUPPORTED MEASUREMENTS:
              
              If the document is clearly Clinical but contains no valid BP or HbA1c
              measurement:
              
              Return:
              
              {
                "documentType": "Clinical",
                "results": []
              }
              
              Do not invent a result.
              
              
              NON-CLINICAL DOCUMENT:
              
              If the document is not clinical:
              
              Return:
              
              {
                "documentType": "Other",
                "results": []
              }
              
              For example, a salary slip must return:
              
              {
                "documentType": "Other",
                "results": []
              }
              
              
              MULTIPLE MEASUREMENTS:
              
              A clinical document can contain both BP and HbA1c.
              
              When valid measurements for both exist:
              
              - Return one selected BP result.
              - Return one selected A1C result.
              
              Example:
              
              {
                "documentType": "Clinical",
                "results": [
                  {
                    "documentType": "BP",
                    "measure": "150/80",
                    "measureDate": "2024-02-17"
                  },
                  {
                    "documentType": "A1C",
                    "measure": "6.2% (Diabetes)",
                    "measureDate": "2024-02-17"
                  }
                ]
              }
              
              
              IMPORTANT:
              
              - The application will perform additional validation after this response.
              - Do not return confidence scores.
              - Do not return needsReview.
              - Do not return reviewReason.
              - Your responsibility is only to classify the document and extract the
                appropriate clinical measurements according to the rules above.
              
              OUTPUT:
              
              Return ONLY JSON matching the requested schema.
              
              For a non-clinical document:
              
              {
                "documentType": "Other",
                "results": []
              }
              
              For a clinical document with no valid supported measurements:
              
              {
                "documentType": "Clinical",
                "results": []
              }
              
              For a clinical document with valid measurements:
              
              {
                "documentType": "Clinical",
                "results": [
                  {
                    "documentType": "BP",
                    "measure": "150/80",
                    "measureDate": "2024-02-17"
                  },
                  {
                    "documentType": "A1C",
                    "measure": "6.2% (Diabetes)",
                    "measureDate": "2024-02-17"
                  }
                ]
              }`
.trim()


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
