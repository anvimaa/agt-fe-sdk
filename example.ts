import { AGTClient, AGTSigner, DocumentType } from './src';

async function main() {
  // Configuração do SDK
  const client = new AGTClient({
    taxRegistrationNumber: '5000000000',
    productId: 'MeuSoftware',
    productVersion: '1.0.0',
    softwareValidationNumber: '0000',
    privateKeyPem: `-----BEGIN PRIVATE KEY-----
... sua chave privada aqui ...
-----END PRIVATE KEY-----`,
    environment: 'hml', // 'hml' para homologação, 'prod' para produção
  });

  try {

    const jwsDocumentSignature = await AGTSigner.signRequest(
      {
        documentNo: 'FT 2025/1',
        taxRegistrationNumber: '5000000000',
        documentType: 'FT',
        documentDate: '2025-12-21',
        customerTaxID: '5417123456',
        customerCountry: 'AO',
        companyName: 'Cliente Exemplo Lda',
        documentTotals: {
          taxPayable: '140.00',
          netTotal: '1000.00',
          grossTotal: '1140.00',
        }
      },
      '-----PEM PRIVATE KEY-----',
    );

    // Exemplo: Registrar uma Fatura
    const response = await client.registerInvoice([
      {
        documentNo: 'FT 2025/1',
        documentStatus: 'N',
        documentDate: '2025-12-21',
        documentType: DocumentType.FT,
        jwsDocumentSignature: jwsDocumentSignature,
        eacCode: '00000',
        systemEntryDate: new Date().toISOString(),
        customerTaxID: '5417123456',
        customerCountry: 'AO',
        companyName: 'Cliente Exemplo Lda',
        lines: [
          {
            lineNumber: '1',
            productCode: 'P001',
            productDescription: 'Produto de Teste',
            quantity: '1',
            unitOfMeasure: 'UN',
            unitPrice: '1000.00',
            unitPriceBase: '1000.00',
            taxes: [
              {
                taxType: 'IVA',
                taxCountryRegion: 'AO',
                taxCode: 'NOR',
                taxPercentage: '14',
              }
            ],
            settlementAmount: '1140.00',
          }
        ],
        documentTotals: {
          taxPayable: '140.00',
          netTotal: '1000.00',
          grossTotal: '1140.00',
        }
      }
    ]);

    console.log('Fatura registrada com sucesso:', response.requestID);

    // Exemplo: Consultar Estado
    const status = await client.getInvoiceStatus(response.requestID);
    console.log('Estado da fatura:', status);

  } catch (error) {
    console.error('Erro ao comunicar com a AGT:', error);
  }
}

// main();
