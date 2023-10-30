import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DrCr, PStatus, VoucherType } from "src/common/enums/all.enum";
import { PageRequest } from "src/common/models/page-request.model";
import { Page } from "src/common/models/page.model";
import { IsNotEmptyString } from "src/common/rules";
import { CommonEntity } from "src/common/trait/entity.trait";
import { ErrorMessage } from "src/errors/error";
import { FiscalYearService } from "src/fiscal-year/fiscalyear.service";
import { LedgerService } from "src/ledgers/service/ledgers.service";
import { Repository } from "typeorm";
import { VoucherCancelDto } from "../dto/voucher.cancel.dto";
import { VoucherEntryDto } from "../dto/voucher.entry.dto";
import { VoucherSearchDto } from "../dto/voucher.search.dto";
import { VoucherCancel } from "../entities/voucher.cancel.entity";
import { Voucher } from "../entities/voucher.entity";
import { VoucherMeta } from "../entities/voucher.meta.entity";
import { IPageable } from "src/common/models/pageable.interface";
import { Generator } from "src/common/helpers/id.generator";

@Injectable()
export class VoucherService extends CommonEntity<Voucher> {
  constructor(
    @InjectRepository(VoucherCancel)
    private voucherCancelRepository: Repository<VoucherCancel>,
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    @InjectRepository(VoucherMeta)
    private voucherMetaRepository: Repository<VoucherMeta>,
    @Inject(forwardRef(() => FiscalYearService))
    private fiscalService: FiscalYearService,
    @Inject(forwardRef(() => LedgerService))
    private ledgerService: LedgerService
  ) {
    super(voucherRepository);
  }

  async getVouchers(
    pageable: IPageable,
    voucherSearchDto: VoucherSearchDto
  ): Promise<Page<Voucher>> {
    return await this.findAllByPage(pageable, voucherSearchDto);
  }
  async addCancelVoucher(voucherCancelDto: VoucherCancelDto, userId: string) {
    const cancelVoucher = this.voucherCancelRepository.create({
      ...voucherCancelDto,
      discarded_by: userId,
    });
    return this.voucherCancelRepository.save(cancelVoucher);
  }

  async getAllCancelVoucher() {
    return this.voucherCancelRepository.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getCancelVoucherById(id: string) {
    return this.voucherCancelRepository.findOneOrFail({ where: { id } });
  }

  async updateCancelVoucherStatus(id: string, status: PStatus) {
    this.voucherCancelRepository.findOneOrFail({ where: { id } });
    return this.voucherCancelRepository.update({ id }, { status });
  }

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
    //check ledgers list validity
    const drList = journalVoucher.drEntry.map((e) => e.ledger_id);
    const crList = journalVoucher.crEntry.map((e) => e.ledger_id);
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
      const { amount, ledger_id, reference_no, reference_date, narration } = e;
      serial_count++;
      return this.voucherMetaRepository.create({
        id: Generator.getId(),
        amount,
        dr_cr: DrCr.DR,
        serial_no: serial_count,
        narration: IsNotEmptyString(narration) ? narration : drNarration,
        ledger_id: ledger_id,
        reference_no,
        reference_date,
      });
    });

    const crentry = journalVoucher.crEntry.map((e) => {
      const { amount, ledger_id, reference_no, reference_date, narration } = e;
      serial_count++;
      return this.voucherMetaRepository.create({
        id: Generator.getId(),
        amount,
        dr_cr: DrCr.CR,
        serial_no: serial_count,
        narration: IsNotEmptyString(narration) ? narration : crNarration,
        ledger_id: ledger_id,
        reference_no,
        reference_date,
      });
    });
    const { transaction_date_en, transaction_date_np, narration } =
      journalVoucher;
    const currentYear = await this.fiscalService.getCurrentYear();
    console.log("user:", userId)
    const voucherRaw = this.voucherRepository.create({
      fiscal_year_id: currentYear.id,
      posted_by: userId,
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
}
