import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoucherEntryDto } from "src/voucher/dto/voucher.entry.dto";
import { VoucherService } from "src/voucher/service/voucher.service";
import { Repository } from "typeorm";
import { InvoiceDto } from "../dto/invoice.dto";
import { InvoiceItemDto } from "../dto/invoice.item.dto";
import { Invoice } from "../entities/invoice.entity";
import { InvoiceItem } from "../entities/invoice.item.entity";

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Invoice)
    private invoiceItemRepository: Repository<InvoiceItem>,
    private voucherService: VoucherService
  ) {}
  async createInvoice(
    invoiceDto: InvoiceDto,
    userId: string
  ): Promise<Invoice> {
    const {
      party_name,
      pan_no,
      address,
      items,
      discount,
      contact,
      notes,
      transaction_date_en,
      transaction_date_np,
    } = invoiceDto;
    let itemsAmount = 0;
    const journalVoucher = new VoucherEntryDto();
    items.forEach((item) => {
      return (itemsAmount += item.rate * item.qty);
    });
    const totlaAmount = itemsAmount - discount;
    journalVoucher.drEntry = [
      {
        amount: totlaAmount,
        ledgerId: "LEDGER_CASH",
        narration: "Receive From " + party_name,
        reference_date: null,
        reference_no: null,
      },
    ];
    journalVoucher.crEntry = [
      {
        amount: totlaAmount,
        ledgerId: "LEDGER_SALE",
        narration: "Cash From " + party_name,
        reference_date: null,
        reference_no: null,
      },
    ];
    journalVoucher.narration =
      "Being cash receive agains \n" +
      items
        .map(
          (e) =>
            e.item_name + "@" + e.qty + " * " + e.rate + "=" + e.qty * e.rate
        )
        .join("\n");
    journalVoucher.transaction_date_en = invoiceDto.transaction_date_en;
    journalVoucher.transaction_date_np = invoiceDto.transaction_date_np;

    const voucher = await this.voucherService.receiveEntry(
      journalVoucher,
      userId
    );
    const invoiceRaw = this.invoiceRepository.create({
      party_name,
      contact,
      notes,
      pan_no,
      address,
      amount: itemsAmount,
      discount,
      total: itemsAmount - discount,
      voucher_id: voucher.id,
      transaction_date_en,
      transaction_date_np,
    });
    const invoice = await this.invoiceRepository.save(invoiceRaw);
    await this.createInvoiceItem(items, invoice);
    return invoice;
  }

  async createInvoiceItem(items: InvoiceItemDto[], invoice: Invoice) {
    const itemList = [];
    for (const item of items) {
      const { rate, qty, ledgerId } = item;
      const invoiceItemRaw = this.invoiceItemRepository.create({
        invoice_id: invoice.id,
        rate,
        qty,
        ledger_id: ledgerId,
      });
      const invoiceItem = await this.invoiceItemRepository.save(invoiceItemRaw);
      itemList.push(invoiceItem);
    }
    return itemList;
  }

  async getInvoices(): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository.find({
      order: {
        createdAt: "DESC",
      },
    });
    return invoices;
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: invoiceId,
      },
    });
    if (!invoice) {
      throw new NotFoundException();
    }
    return invoice;
  }

  async cancelInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: invoiceId,
      },
    });
    if (!invoice) {
      throw new NotFoundException();
    }
    return invoice;
  }
}
