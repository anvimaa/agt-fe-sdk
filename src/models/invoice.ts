export interface SoftwareInfoDetail {
  productId: string;
  productVersion: string;
  softwareValidationNumber: string;
}

export interface SoftwareInfo {
  softwareInfoDetail: SoftwareInfoDetail;
  jwsSoftwareSignature: string;
}

export interface Tax {
  taxType: string;
  taxCountryRegion: string;
  taxCode: string;
  taxPercentage: string;
  taxContribution?: string;
  taxBase?: string;
  taxAmount?: string;
  taxExemptionCode?: string;
}

export interface ReferenceInfo {
  reference: string;
  reason: string;
  referenceItemLineNo: string;
}

export interface InvoiceLine {
  lineNumber: string;
  productCode: string;
  productDescription: string;
  quantity: string;
  unitOfMeasure: string;
  unitPrice: string;
  unitPriceBase: string;
  debitAmount?: string;
  creditAmount?: string;
  referenceInfo?: ReferenceInfo;
  taxes: Tax[];
  settlementAmount: string;
}

export interface SourceDocumentID {
  originatingON: string;
  documentDate: string;
}

export interface SourceDocument {
  lineNo: string;
  sourceDocumentID: SourceDocumentID;
  debitAmount: string;
  creditAmount: string;
}

export interface PaymentReceipt {
  sourceDocuments: SourceDocument[];
}

export interface Currency {
  currencyCode: string;
  currencyAmount: string;
  exchangeRate: string;
}

export interface DocumentTotals {
  taxPayable: string;
  netTotal: string;
  grossTotal: string;
  currency?: Currency;
}

export interface WithholdingTax {
  withholdingTaxType: string;
  withholdingTaxDescription: string;
  withholdingTaxAmount: string;
}

export interface InvoiceDocument {
  documentNo: string;
  documentStatus: string;
  documentCancelReason?: string;
  rejectedDocumentNo?: string;
  jwsDocumentSignature: string;
  documentDate: string;
  documentType: string;
  eacCode: string;
  systemEntryDate: string;
  customerTaxID: string;
  customerCountry: string;
  companyName: string;
  lines: InvoiceLine[];
  paymentReceipt?: PaymentReceipt;
  documentTotals: DocumentTotals;
  withholdingTaxList?: WithholdingTax[];
}

export interface RegisterInvoiceRequest {
  schemaVersion: string;
  submissionUUID: string;
  taxRegistrationNumber: string;
  submissionTimeStamp: string;
  softwareInfo: SoftwareInfo;
  numberOfEntries: string;
  documents: InvoiceDocument[];
}

export interface ErrorDetail {
  idError: string;
  documentNo?: string;
  descriptionError: string;
}

export interface RegisterInvoiceResponse {
  requestID: string;
  errorList: ErrorDetail[];
}
