import DocumentIntelligence, {
    getLongRunningPoller,
    isUnexpected,
    AnalyzeOperationOutput,
  } from '@azure-rest/ai-document-intelligence';
  
  const endpoint = process.env.DOCUMENT_INTELLIGENCE_ENDPOINT;
  const apiKey = process.env.DOCUMENT_INTELLIGENCE_API_KEY;
  
  if (!endpoint) {
    throw new Error(
      'DOCUMENT_INTELLIGENCE_ENDPOINT is not configured',
    );
  }
  
  if (!apiKey) {
    throw new Error(
      'DOCUMENT_INTELLIGENCE_API_KEY is not configured',
    );
  }
  
  const client = DocumentIntelligence(endpoint, {
    key: apiKey,
  });
  
  export const extractDocumentText = async (
    document: Buffer,
  ): Promise<string> => {
    const base64Source = document.toString('base64');
  
    const initialResponse = await client
      .path(
        '/documentModels/{modelId}:analyze',
        'prebuilt-read',
      )
      .post({
        contentType: 'application/json',
        body: {
          base64Source,
        },
      });
  
    if (isUnexpected(initialResponse)) {
      throw new Error(
        `Document Intelligence request failed: ${JSON.stringify(
          initialResponse.body,
        )}`,
      );
    }
  
    const poller = getLongRunningPoller(
      client,
      initialResponse,
    );
  
    const result = (
        await poller.pollUntilDone()
      ).body as AnalyzeOperationOutput;
      
      const analyzeResult = result.analyzeResult;
  
    return analyzeResult?.content ?? '';
  };