import { google } from '@google-cloud/documentai/build/protos/protos';

export enum ReceiptType {
  A = 'A',
  B = 'B',
  C = 'C',
  E = 'E',
  M = 'M',
}

export enum DocumentType {
  FACTURA = 'FACTURA',
  NOTA_CREDITO = 'NOTA CREDITO',
  NOTA_DEBITO = 'NOTA DEBITO',
  RECIBO = 'RECIBO',
  COMPROBANTE_COMPRA = 'COMPROBANTE COMPRA',
}

export interface ParsedDocument {
  id: string;
  type: string;
  mentionText: string;
  mentionId: string;
  confidence: number;
  normalizedValue: google.cloud.documentai.v1.Document.Entity.INormalizedValue;
  properties: ParsedDocument[];
}
