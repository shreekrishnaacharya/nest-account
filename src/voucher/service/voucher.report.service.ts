import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DrCr, VoucherType } from "src/common/enums/all.enum";
import { IsNotEmptyString } from "src/common/rules/isdateinformat";
import { ErrorMessage } from "src/errors/error";
import { FiscalYearService } from "src/fiscal-year/fiscalyear.service";
import { LedgerService } from "src/ledgers/service/ledgers.service";
import { Repository } from "typeorm";
import { VoucherEntryDto } from "../dto/voucher.entry.dto";
import { VoucherCancel } from "../entities/voucher.cancel.entity";
import { Voucher } from "../entities/voucher.entity";
import { VoucherMeta } from "../entities/voucher.meta.entity";

@Injectable()
export class VoucherReportService {
  constructor(
    @InjectRepository(VoucherCancel)
    private voucherDeletedRepository: Repository<VoucherCancel>,
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    @InjectRepository(VoucherMeta)
    private voucherMetaRepository: Repository<VoucherMeta>,
    @Inject(forwardRef(() => FiscalYearService))
    private fiscalService: FiscalYearService,
    @Inject(forwardRef(() => LedgerService))
    private ledgerService: LedgerService
  ) {}

  async purchaseEntry(
    journalVoucher: VoucherEntryDto,
    userId: string
  ): Promise<Voucher> {
    return this.journalVoucher(journalVoucher, userId, VoucherType.PURCHASE);
  }

  async paymentEntry(
    journalVoucher: VoucherEntryDto,
    userId: string
  ): Promise<Voucher> {
    return this.journalVoucher(journalVoucher, userId, VoucherType.PAYMENT);
  }

  async contraEntry(
    journalVoucher: VoucherEntryDto,
    userId: string
  ): Promise<Voucher> {
    return this.journalVoucher(journalVoucher, userId, VoucherType.CONTRA);
  }

  async journalEntry(
    journalVoucher: VoucherEntryDto,
    userId: string
  ): Promise<Voucher> {
    return this.journalVoucher(journalVoucher, userId, VoucherType.JOURNAL);
  }

  async receiveEntry(
    journalVoucher: VoucherEntryDto,
    userId: string
  ): Promise<Voucher> {
    return this.journalVoucher(journalVoucher, userId, VoucherType.RECEIVE);
  }

  private async journalVoucher(
    journalVoucher: VoucherEntryDto,
    userId: string,
    voucherType: VoucherType
  ): Promise<Voucher> {
    journalVoucher.isValidEntry();
    //check ledgers list validity
    const drList = journalVoucher.drEntry.map((e) => e.ledgerId);
    const crList = journalVoucher.crEntry.map((e) => e.ledgerId);
    const ledgersList = [...drList, ...crList];
    const ledgers = await this.ledgerService.getLedgerByIds(ledgersList);
    if (ledgers.length != ledgersList.length) {
      throw new BadRequestException(ErrorMessage.JOURNAL_ENTRY_INVALID_LEDGER);
    }
    const reportObject = ledgers.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    const drNarration = drList
      .map((e) => {
        return reportObject[e]["name"];
      })
      .join(" ");

    const crNarration = crList
      .map((e) => {
        return reportObject[e]["name"];
      })
      .join(" ");

    let serial_count = 0;
    const drentry = journalVoucher.drEntry.map((e) => {
      const { amount, ledgerId, reference_no, reference_date, narration } = e;
      serial_count++;
      return this.voucherMetaRepository.create({
        amount,
        dr_cr: DrCr.DR,
        serial_no: serial_count,
        narration: IsNotEmptyString(narration) ? narration : drNarration,
        ledger_id: ledgerId,
        reference_no,
        reference_date,
      });
    });

    const crentry = journalVoucher.crEntry.map((e) => {
      const { amount, ledgerId, reference_no, reference_date, narration } = e;
      serial_count++;
      return this.voucherMetaRepository.create({
        amount,
        dr_cr: DrCr.CR,
        serial_no: serial_count,
        narration: IsNotEmptyString(narration) ? narration : crNarration,
        ledger_id: ledgerId,
        reference_no,
        reference_date,
      });
    });
    const { transaction_date_en, transaction_date_np, narration } =
      journalVoucher;
    const currentYear = await this.fiscalService.getCurrentYear();
    const voucherRaw = this.voucherRepository.create({
      fiscal_year_id: currentYear.id,
      approved_by: userId,
      narration,
      transaction_date_en,
      transaction_date_np,
      type: voucherType,
    });
    const voucherModel = await this.voucherRepository.save(voucherRaw);
    const voucherMeta = [...drentry, ...crentry].map((e) => {
      return { ...e, voucher_id: voucherModel.id };
    });
    const queryBuilder = this.voucherMetaRepository.createQueryBuilder();
    await queryBuilder.insert().into(VoucherMeta).values(voucherMeta).execute();

    return voucherModel;
  }
  async getVouchers(): Promise<Voucher[]> {
    const vouchers = await this.voucherRepository.find({
      order: {
        id: "DESC",
      },
    });
    return vouchers;
  }
}
