import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { DateType } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";

export class FiscalYearDto extends BaseEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  openingDateNp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  openingDateEn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  closingDateNp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  closingDateEn: string;

  @ApiProperty({ enum: DateType })
  @IsString()
  @IsNotEmpty()
  date_type: DateType;
}
