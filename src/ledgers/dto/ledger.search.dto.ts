import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { IsRelational } from "src/common/decorators/dto";
import { Status } from "src/common/enums/all.enum";
import { LedgerTypes } from "src/common/enums/ledger.group";
import { QueryDto } from "src/common/trait/query.dto";

export class LedgerSearchDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({ required: false, type: "enum", enum: LedgerTypes })
  @IsString()
  @IsOptional()
  type: LedgerTypes;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsRelational()
  ledgerGroup: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @IsRelational()
  @Type(() => Boolean)
  user: boolean;

  @ApiProperty({
    type: "enum",
    enum: Status,
    required: false,
  })
  @IsString()
  @IsOptional()
  status: Status;

}
