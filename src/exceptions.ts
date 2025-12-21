export class AGTSDKError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'AGTSDKError';
  }
}

export class AGTAuthError extends AGTSDKError {
  constructor(message: string, details?: any) {
    super(message, 'AUTH_ERROR', details);
    this.name = 'AGTAuthError';
  }
}

export class AGTValidationError extends AGTSDKError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'AGTValidationError';
  }
}

export class AGTApiError extends AGTSDKError {
  constructor(message: string, code: string, public status: number, details?: any) {
    super(message, code, details);
    this.name = 'AGTApiError';
  }
}
