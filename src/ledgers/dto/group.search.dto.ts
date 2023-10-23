import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { IsAndClause, IsLikeCheck, IsRelational } from "src/common/decorators/dto";
import { QueryDto } from "src/common/trait/query.dto";

export class GroupSearchDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsLikeCheck()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsLikeCheck()
  bs_type: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsLikeCheck()
  bs_head: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsAndClause()
  account_side: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsAndClause()
  is_fixed: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @IsRelational()
  @Type(() => Boolean)
  user: boolean;

}
