import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsDateString, IsNotEmpty, IsString } from "class-validator";
import { IsDateInFormat } from "src/common/rules/isdateinformat";
import { ErrorMessage } from "src/errors/error";
import { VoucherMetaDto } from "./voucher.meta.dto";
import { Type } from "class-transformer";

export class VoucherEntryDto {
  @ApiProperty({ type: [VoucherMetaDto] })
  @IsNotEmpty({ message: 'Dr entry should not be empty' })
  @Type(() => Array<VoucherMetaDto>)
  drEntry: VoucherMetaDto[];

  @ApiProperty({ type: [VoucherMetaDto] })
  @IsArray()
  @IsNotEmpty({ message: 'Cr entry should not be empty' })
  @Type(() => Array<VoucherMetaDto>)
  crEntry: VoucherMetaDto[];

  @ApiProperty()
  @IsDateString(undefined, { message: 'Invalid date format. Please use the format YYYY-MM-DD' })
  @IsNotEmpty({ message: 'English date should not be empty' })
  transaction_date_en: string;

  @ApiProperty()
  @IsDateInFormat("YYYY-MM-DD")
  @IsNotEmpty({ message: 'Nepali date should not be empty' })
  transaction_date_np: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Narration should not be empty' })
  narration: string;

  isValidEntry = () => {
    let totalDr = 0;
    let totalCr = 0;
    const drLedger = {};
    const crLedger = {};
    this.drEntry.forEach((e) => {
      totalDr += e.amount;
      drLedger[e.ledgerId] = e.ledgerId;
    });
    this.crEntry.forEach((e) => {
      totalCr += e.amount;
      crLedger[e.ledgerId] = e.ledgerId;
    });
    if (totalCr != totalDr) {
      throw new BadRequestException(ErrorMessage.JOURNAL_ENTRY_DR_CR_NOT_EQUAL);
    }

    if (this.drEntry.length > Object.keys(drLedger).length) {
      throw new BadRequestException(ErrorMessage.JOURNAL_ENTRY_DR_CR_NOT_EQUAL);
    }

    if (this.crEntry.length > Object.keys(crLedger).length) {
      throw new BadRequestException(ErrorMessage.JOURNAL_ENTRY_DR_CR_NOT_EQUAL);
    }
    return true;
  };
}
