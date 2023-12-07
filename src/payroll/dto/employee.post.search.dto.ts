import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { IsDateInFormat, IsValidEntry } from "src/common/rules";
import { EmploymentType, Gender, MonthList } from "src/common/enums/all.enum";
import { IQueryClause, QueryDto } from "src/common/trait/query.dto";
import { IsRelational } from "src/common/decorators/dto";

export class EmployeePostSearchDto extends QueryDto {

  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  ledger_code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsRelational()
  ledger: boolean;

}
