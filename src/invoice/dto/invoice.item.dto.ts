import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InvoiceItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  item_name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ledgerId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  rate: number;
}
