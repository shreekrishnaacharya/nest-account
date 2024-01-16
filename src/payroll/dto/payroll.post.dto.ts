import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { MonthList } from "src/common/enums/all.enum";
enum SelectionType {
  ALL = "all",
  OTHER = "other"
}
export class PayrollPostDto {
  @ApiProperty({ type: "enum", enum: SelectionType })
  @IsString()
  @IsNotEmpty()
  all: SelectionType;

  @ApiProperty({ type: Array<String> })
  employees: string[];

  @ApiProperty()
  @IsDateString(undefined, { message: 'Invalid date format. Please use the format YYYY-MM-DD' })
  @IsNotEmpty({ message: 'English date cannot be empty' })
  transaction_date_en: string;

  @ApiProperty()
  // @IsDateInFormat("YYYY-MM-DD")
  @IsNotEmpty({ message: 'Nepali date cannot be empty' })
  transaction_date_np: string;

}
