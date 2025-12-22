export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number; // ex: 0.14
  discountPercent?: number; // ex: 10 para 10%
};

export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calcula os totais financeiros de um documento de faturação
 * em conformidade com as regras fiscais da AGT / SAFT.
 *
 * Regras aplicadas:
 * - O desconto é percentual e reduz a base tributável
 * - O imposto é calculado sobre o valor líquido (após desconto)
 * - O cálculo é feito item a item
 * - Arredondamento fiscal a 2 casas decimais (ROUND_HALF_UP)
 * - grossTotal = netTotal + taxPayable
 *
 * @param {InvoiceItem[]} items
 * Lista de itens da fatura.
 *
 * Cada item deve conter:
 * - quantity: Quantidade faturada
 * - unitPrice: Preço unitário
 * - taxPercent: Parcentagem da Taxa de imposto (ex: 14 para IVA)
 * - discountPercent (opcional): Percentagem de desconto aplicada ao item
 *
 * @returns
 * Totais do documento:
 * - netTotal: Total líquido sem impostos
 * - taxPayable: Total de impostos a pagar
 * - grossTotal: Total bruto do documento
 *
 * @example
 * const totals = calculateDocumentTotals([
 *   { quantity: 1, unitPrice: 100000, taxPercent: 14, discountPercent: 10 },
 *   { quantity: 2, unitPrice: 50000,  taxPercent: 14 }
 * ])
 *
 * // Resultado:
 * // {
 * //   netTotal: 180000,
 * //   taxPayable: 25200,
 * //   grossTotal: 205200
 * // }
 */
export function calculateDocumentTotals(items: InvoiceItem[]) {
  let netTotal = 0;
  let taxPayable = 0;

  for (const item of items) {
    const grossItemValue = item.quantity * item.unitPrice;

    const discountValue = item.discountPercent
      ? grossItemValue * (item.discountPercent / 100)
      : 0;

    const itemNet = round(grossItemValue - discountValue);
    const itemTax = round(itemNet * (item.taxPercent / 100));

    netTotal += itemNet;
    taxPayable += itemTax;
  }

  netTotal = round(netTotal);
  taxPayable = round(taxPayable);

  const grossTotal = round(netTotal + taxPayable);

  return {
    netTotal,
    taxPayable,
    grossTotal,
  };
}
