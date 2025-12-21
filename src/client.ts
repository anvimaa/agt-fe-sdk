import axios, { AxiosInstance } from "axios";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL_HML, BASE_URL_PROD, Endpoints } from "./constants";
import { AGTSigner } from "./security/signer";
import {
  InvoiceDocument,
  RegisterInvoiceRequest,
  RegisterInvoiceResponse,
} from "./models/invoice";
import { AGTApiError } from "./exceptions";

export interface AGTConfig {
  taxRegistrationNumber: string;
  productId: string;
  productVersion: string;
  softwareValidationNumber: string;
  privateKeyPem: string;
  environment: "hml" | "prod";
}

export class AGTClient {
  private axiosInstance: AxiosInstance;
  private config: AGTConfig;

  constructor(config: AGTConfig) {
    this.config = config;
    const baseURL =
      config.environment === "prod" ? BASE_URL_PROD : BASE_URL_HML;

    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  private async getSoftwareInfo() {
    const jwsSoftwareSignature = await AGTSigner.signSoftwareInfo(
      this.config.productId,
      this.config.productVersion,
      this.config.softwareValidationNumber,
      this.config.privateKeyPem,
    );

    return {
      softwareInfoDetail: {
        productId: this.config.productId,
        productVersion: this.config.productVersion,
        softwareValidationNumber: this.config.softwareValidationNumber,
      },
      jwsSoftwareSignature,
    };
  }

  /**
   * Registra uma ou mais faturas na AGT.
   */
  async registerInvoice(
    documents: InvoiceDocument[],
  ): Promise<RegisterInvoiceResponse> {
    const submissionUUID = uuidv4();
    const submissionTimeStamp = new Date().toISOString();
    const softwareInfo = await this.getSoftwareInfo();

    const payload: RegisterInvoiceRequest = {
      schemaVersion: "1.0",
      submissionUUID,
      taxRegistrationNumber: this.config.taxRegistrationNumber,
      submissionTimeStamp,
      softwareInfo,
      numberOfEntries: documents.length.toString(),
      documents,
    };

    try {
      const response = await this.axiosInstance.post<RegisterInvoiceResponse>(
        Endpoints.REGISTAR_FACTURA,
        payload,
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Obtém o estado de validação de uma fatura.
   */
  async getInvoiceStatus(requestID: string): Promise<any> {
    const softwareInfo = await this.getSoftwareInfo();
    const jwsSignature = await AGTSigner.signRequest(
      { taxRegistrationNumber: this.config.taxRegistrationNumber, requestID },
      this.config.privateKeyPem,
    );
    const submissionUUID = uuidv4();
    const submissionTimeStamp = new Date().toISOString();

    try {
      const response = await this.axiosInstance.post(Endpoints.OBTER_ESTADO, {
        schemaVersion: "1.0",
        taxRegistrationNumber: this.config.taxRegistrationNumber,
        submissionUUID,
        submissionTimeStamp,
        softwareInfo,
        jwsSignature,
        requestID,
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Lista faturas num intervalo de datas.
   */
  async listInvoices(
    queryStartDate: string,
    queryEndDate: string,
  ): Promise<any> {
    const softwareInfo = await this.getSoftwareInfo();
    const jwsSignature = await AGTSigner.signRequest(
      {
        taxRegistrationNumber: this.config.taxRegistrationNumber,
        queryStartDate,
        queryEndDate,
      },
      this.config.privateKeyPem,
    );
    const submissionUUID = uuidv4();
    const submissionTimeStamp = new Date().toISOString();

    try {
      const response = await this.axiosInstance.post(
        Endpoints.LISTAR_FACTURAS,
        {
          schemaVersion: "1.0",
          taxRegistrationNumber: this.config.taxRegistrationNumber,
          submissionGUID: submissionUUID,
          submissionTimeStamp,
          softwareInfo,
          jwsSignature,
          queryStartDate,
          queryEndDate,
        },
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Consulta os detalhes de uma fatura específica.
   */
  async getInvoiceDetails(invoiceNo: string): Promise<any> {
    const softwareInfo = await this.getSoftwareInfo();
    const jwsSignature = await AGTSigner.signRequest(
      { taxRegistrationNumber: this.config.taxRegistrationNumber, invoiceNo },
      this.config.privateKeyPem,
    );
    const submissionUUID = uuidv4();
    const submissionTimeStamp = new Date().toISOString();

    try {
      const response = await this.axiosInstance.post(
        Endpoints.CONSULTAR_FACTURA,
        {
          schemaVersion: "1.0",
          taxRegistrationNumber: this.config.taxRegistrationNumber,
          submissionUUID: submissionUUID,
          submissionTimeStamp,
          invoiceNo,
          softwareInfo,
          jwsSignature,
        },
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Solicita uma nova série de faturação.
   */
  async requestSeries(data: {
    seriesYear: string;
    documentType: string;
    establishmentNumber: string;
    seriesContingencyIndicator: string;
  }): Promise<any> {
    const softwareInfo = await this.getSoftwareInfo();
    const jwsSignature = await AGTSigner.signRequest(
      {
        taxRegistrationNumber: this.config.taxRegistrationNumber,
        seriesYear: data.seriesYear,
        documentType: data.documentType,
      },
      this.config.privateKeyPem,
    );
    const submissionUUID = uuidv4();
    const submissionTimeStamp = new Date().toISOString();

    try {
      const response = await this.axiosInstance.post(
        Endpoints.SOLICITAR_SERIE,
        {
          schemaVersion: "1.0",
          taxRegistrationNumber: this.config.taxRegistrationNumber,
          submissionUUID: submissionUUID,
          submissionTimeStamp,
          softwareInfo,
          ...data,
          jwsSignature,
        },
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.response) {
      throw new AGTApiError(
        error.response.data?.descriptionError || "Erro na API da AGT",
        error.response.data?.idError || "API_ERROR",
        error.response.status,
        error.response.data,
      );
    }
    throw error;
  }
}
