# AGT Faturação Eletrónica SDK (Node.JS)

Este SDK permite a integração simplificada com os serviços de Faturação Eletrónica da AGT (Administração Geral Tributária) de Angola, utilizando a API REST em conformidade com o Decreto Executivo n.º 683/25 de 22 de Agosto.

## Funcionalidades

- Registro de Faturas (FT, FR, VD, NC, ND)
- Consulta de Estado de Validação
- Listagem de Faturas
- Consulta de Detalhes de Fatura
- Solicitação de Séries de Faturação
- Assinatura Digital JWS (RS256) integrada

## Instalação

```bash
pnpm add agt-fe-sdk
# ou
npm install agt-fe-sdk
```

## Como Usar

### Configuração Inicial

```typescript
import { AGTClient } from 'agt-fe-sdk';

const client = new AGTClient({
  taxRegistrationNumber: '5000000000',
  productId: 'NomeDoSoftware',
  productVersion: '1.0.0',
  softwareValidationNumber: '9999',
  privateKeyPem: '-----PEM PRIVATE KEY-----...',
  environment: 'hml', // ou 'prod'
});
```

### Registrar uma Fatura

```typescript
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

const response = await client.registerInvoice([
  {
    documentNo: 'FT 2025/1',
    documentStatus: 'N',
    documentDate: '2025-12-21',
    documentType: 'FT',
    jwsDocumentSignature,
    // ... outros campos obrigatórios conforme o decreto.
    documentTotals: {
      taxPayable: '140.00',
      netTotal: '1000.00',
      grossTotal: '1140.00',
    }
  }
]);
```

### Consultar Estado

```typescript
const status = await client.getInvoiceStatus('ID_DO_PEDIDO');
```

## Requisitos de Segurança

O SDK lida automaticamente com a geração das assinaturas JWS (JSON Web Signature) exigidas pela AGT:
1. **jwsSoftwareSignature**: Assinatura dos dados do software.
2. **jwsSignature**: Assinatura da requisição específica.
3. **jwsDocumentSignature**: Deve ser fornecida no objeto do documento (gerada pelo software de faturação).

## Licença

ISC
