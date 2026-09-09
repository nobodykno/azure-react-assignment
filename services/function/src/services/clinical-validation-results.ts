interface ClinicalResult {
    documentType: 'BP' | 'A1C';
    measure: string;
    measureDate: string;
  }
  
  export interface ClinicalValidationResult {
    results: ClinicalResult[];
    confidence: number;
    needsReview: boolean;
    reviewReason: string;
  }
  
  export const validateClinicalResults = (
    documentType: 'Clinical' | 'Other',
    results: ClinicalResult[],
  ): ClinicalValidationResult => {
    // Non-clinical document
    if (documentType === 'Other') {
      return {
        results: [],
        confidence: 1,
        needsReview: true,
        reviewReason: '',
      };
    }
  
    // Clinical document but no supported measurement found
    if (results.length === 0) {
      return {
        results: [],
        confidence: 0.5,
        needsReview: true,
        reviewReason:
          'Clinical document detected, but no valid BP or HbA1c measurement could be extracted.',
      };
    }
  
    const validatedResults: ClinicalResult[] = [];
    const reviewReasons: string[] = [];
  
    for (const result of results) {
      if (result.documentType === 'BP') {
        const validation = validateBloodPressure(result);
  
        if (validation.valid) {
          validatedResults.push(result);
        } else {
          reviewReasons.push(validation.reason);
        }
      }
  
      if (result.documentType === 'A1C') {
        const validation = validateA1C(result);
  
        if (validation.valid) {
          validatedResults.push(result);
        } else {
          reviewReasons.push(validation.reason);
        }
      }
    }
  
    // All extracted results were invalid
    if (validatedResults.length === 0) {
      return {
        results: [],
        confidence: 0.3,
        needsReview: true,
        reviewReason: reviewReasons.join('; '),
      };
    }
  
    // Some results were valid but some were invalid
    if (validatedResults.length < results.length) {
      return {
        results: validatedResults,
        confidence: 0.7,
        needsReview: true,
        reviewReason: reviewReasons.join('; '),
      };
    }
  
    // All extracted results are valid
    return {
      results: validatedResults,
      confidence: 0.95,
      needsReview: false,
      reviewReason: '',
    };
  };
  
  const validateBloodPressure = (
    result: ClinicalResult,
  ): { valid: boolean; reason: string } => {
    const match = result.measure.match(
      /^(\d{2,3})\/(\d{2,3})$/,
    );
  
    if (!match) {
      return {
        valid: false,
        reason: 'Invalid blood pressure format.',
      };
    }
  
    const systolic = Number(match[1]);
    const diastolic = Number(match[2]);
  
    if (systolic <= 0 || diastolic <= 0) {
      return {
        valid: false,
        reason: 'Invalid blood pressure values.',
      };
    }
  
    if (!result.measureDate) {
      return {
        valid: false,
        reason: 'Blood pressure date could not be determined.',
      };
    }
  
    return {
      valid: true,
      reason: '',
    };
  };
  
  const validateA1C = (
    result: ClinicalResult,
  ): { valid: boolean; reason: string } => {
    const match = result.measure.match(
      /^(\d+(?:\.\d+)?)%/,
    );
  
    if (!match) {
      return {
        valid: false,
        reason: 'Invalid HbA1c format.',
      };
    }
  
    const value = Number(match[1]);
  
    if (value <= 0 || value > 100) {
      return {
        valid: false,
        reason: 'Invalid HbA1c value.',
      };
    }
  
    if (!result.measureDate) {
      return {
        valid: false,
        reason: 'HbA1c date could not be determined.',
      };
    }
  
    return {
      valid: true,
      reason: '',
    };
  };