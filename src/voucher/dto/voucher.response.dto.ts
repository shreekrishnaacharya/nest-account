import { ApiProperty } from "@nestjs/swagger";
import { Page } from "src/common/models/page.model";

export class VoucherResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  voucher_no: number;
  @ApiProperty()
  posted_by: string;
  @ApiProperty()
  narration: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  transaction_date_en: Date;
  @ApiProperty()
  transaction_date_np: string;
}

export class VoucherPage extends Page<VoucherResponseDto> {
  @ApiProperty({ type: [VoucherResponseDto] })
  public elements: VoucherResponseDto[];
}
