import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { IsDateInFormat } from "src/common/rules/isdateinformat";
import { InvoiceItemDto } from "./invoice.item.dto";

export class InvoiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  party_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contact: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pan_no: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  discount: number;

  @ApiProperty()
  @IsDate()
  @IsDateInFormat("YYYY-MM-DD")
  @IsNotEmpty()
  transaction_date_en: string;

  @ApiProperty()
  @IsDateInFormat("YYYY-MM-DD")
  @IsNotEmpty()
  transaction_date_np: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({ type: [InvoiceItemDto] })
  @IsArray()
  @IsNotEmpty()
  items: InvoiceItemDto[];
}
