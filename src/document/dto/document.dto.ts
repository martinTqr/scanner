import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EnumToString } from 'src/config/helpers/enumToString';
import { EditItemByDocumentDto } from 'src/document-item/entities/document-item.entity';
import { EditTaxByDocument } from 'src/document-tax/entities/document-tax.entity';
import { DocumentType, ReceiptType } from '../intefaces/document-ai.interfaces';
import { Type } from 'class-transformer';

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

export class EditDocumentDto {
  @IsOptional()
  @IsString()
  providerName: string;

  @IsOptional()
  @IsString()
  providerCuit: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  expirationDate: string;

  @IsOptional()
  @IsString()
  observations: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditItemByDocumentDto)
  items: EditItemByDocumentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditTaxByDocument)
  taxes?: EditTaxByDocument[];

  @IsOptional()
  @IsEnum(DocumentType, {
    message: `Tipo de documento inválido. Las opciones son ${EnumToString(
      DocumentType,
    )}`,
  })
  documentType: DocumentType;

  @IsOptional()
  @IsEnum(ReceiptType, {
    message: `Tipo de recibo inválido. Las opciones son ${EnumToString(
      ReceiptType,
    )}`,
  })
  receiptType: ReceiptType;
}
