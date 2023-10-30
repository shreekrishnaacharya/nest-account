import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { IsDateInFormat, IsValidEntry } from "src/common/rules";
import { EmploymentType, Gender } from "src/common/enums/all.enum";
import { IQueryClause, QueryDto } from "src/common/trait/query.dto";

export class EmployeeSearchDto extends QueryDto{

  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @ApiProperty({ required: true })
  @IsOptional({ message: "Ledger code cannot be empty" })
  ledger_code: string;

}
