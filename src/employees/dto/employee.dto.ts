import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { IsDateInFormat, IsValidEntry } from "src/common/rules";
import { EmploymentType, Gender, Status } from "src/common/enums/all.enum";

export class EmployeeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString(undefined, { message: 'Invalid date format. Please use the format YYYY-MM-DD' })
  dob_en: string;

  @ApiProperty({ required: false })
  @IsOptional()
  dob_np: string;

  @ApiProperty({ required: false })
  @IsOptional()
  doj_np: string;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  doj_en: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  phone1: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone2: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsEnum(EmploymentType)
  @IsNotEmpty({ message: 'Employment cannot be empty' })
  employment: EmploymentType;

  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bank_no: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address1: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address2: string;

  @ApiProperty({ required: false })
  @IsOptional()
  qualification: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: "Ledger name cannot be empty" })
  ledger_name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: "Ledger code cannot be empty" })
  ledger_code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  status: Status;
}
