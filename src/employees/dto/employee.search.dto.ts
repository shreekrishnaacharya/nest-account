import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { IsDateInFormat, IsValidEntry } from "src/common/rules";
import { EmploymentType, Gender } from "src/common/enums/all.enum";
import { IQueryClause, QueryDto } from "src/common/trait/query.dto";
import { IsRelational } from "src/common/decorators/dto";

export class EmployeeSearchDto extends QueryDto{

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @ApiProperty({ required: true })
  @IsOptional()
  ledger_code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsRelational()
  ledger: boolean;

}
