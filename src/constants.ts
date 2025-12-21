export const BASE_URL_HML = "https://sifphml.minfin.gov.ao";
export const BASE_URL_PROD = "https://sifp.minfin.gov.ao";

export enum Endpoints {
  REGISTAR_FACTURA = "/sigt/fe/v1/registarFactura",
  OBTER_ESTADO = "/sigt/fe/v1/obterEstado",
  LISTAR_FACTURAS = "/sigt/fe/v1/listarFacturas",
  CONSULTAR_FACTURA = "/sigt/fe/v1/consultarFactura",
  SOLICITAR_SERIE = "/sigt/fe/v1/solicitarSerie",
  LISTAR_SERIES = "/sigt/fe/v1/listarSeries",
  VALIDAR_DOCUMENTO = "/sigt/fe/v1/validarDocumento",
}

export enum DocumentType {
  FR = "FR", // Fatura Recibo
  FT = "FT", // Fatura
  VD = "VD", // Venda a Dinheiro
  NC = "NC", // Nota de Crédito
  ND = "ND", // Nota de Débito
}

export const SIGNATURE_ALGORITHM = "RS256";
