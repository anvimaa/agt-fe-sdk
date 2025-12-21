import * as jose from "jose";

export class AGTSigner {
  /**
   * Gera uma assinatura JWS (RS256) para os dados fornecidos.
   * @param data O objeto a ser assinado.
   * @param privateKeyPem A chave privada em formato PEM.
   * @returns A assinatura JWS em formato string.
   */
  static async sign(data: any, privateKeyPem: string): Promise<string> {
    const privateKey = await jose.importPKCS8(privateKeyPem, "RS256");

    const jws = await new jose.CompactSign(
      new TextEncoder().encode(JSON.stringify(data)),
    )
      .setProtectedHeader({ alg: "RS256" })
      .sign(privateKey);

    return jws;
  }

  /**
   * Gera a assinatura do software (jwsSoftwareSignature).
   * Todos os campos do objeto softwareInfoDetail devem ser usados.
   */
  static async signSoftwareInfo(
    productId: string,
    productVersion: string,
    softwareValidationNumber: string,
    privateKeyPem: string,
  ): Promise<string> {
    const data = {
      productId,
      productVersion,
      softwareValidationNumber,
    };
    return this.sign(data, privateKeyPem);
  }

  /**
   * Gera a assinatura da solicitação (jwsSignature).
   * Geralmente usa taxRegistrationNumber e requestID.
   */
  static async signRequest(
    payload: any,
    privateKeyPem: string,
  ): Promise<string> {
    return this.sign(payload, privateKeyPem);
  }
}
