import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EnumToString } from 'src/config/helpers/enumToString';
import { DocumentType, ReceiptType } from '../intefaces/document-ai.interfaces';

export class GetDocumentDto {
  @IsString()
  @IsOptional()
  providerName: string;

  @IsString()
  @IsOptional()
  providerCuit: string;

  @IsOptional()
  @IsEnum(DocumentType, {
    message: `Tipo de documento inválido. Las opciones son ${EnumToString(
      DocumentType,
    )}`,
  })
  documentType: DocumentType;

  @IsOptional()
  @IsEnum(ReceiptType, {
    message: `Tipo de comprobante inválido. Las opciones son ${EnumToString(
      ReceiptType,
    )}`,
  })
  receiptType: ReceiptType;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;

  @IsString()
  @IsOptional()
  batch: string;
}
