import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PageRequest } from "src/common/models/page-request.model";
import { Page } from "src/common/models/page.model";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { VoucherEntryDto } from "./dto/voucher.entry.dto";
import { VoucherSearchDto } from "./dto/voucher.search.dto";
import { Voucher } from "./entities/voucher.entity";
import { VoucherService } from "./service/voucher.service";

@ApiTags("voucher")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("voucher")
export class VoucherController {
  constructor(private voucherService: VoucherService) {}

  @Get("/")
  getVouchers(
    @Query() voucherSearchDto: VoucherSearchDto,
    @Query() pageRequest: PageRequest
  ): Promise<Page<Voucher>> {
    return this.voucherService.getVouchers(pageRequest, voucherSearchDto);
  }

  @Post("/purchase")
  addPurchase(
    @Body() voucherDto: VoucherEntryDto,
    @Request() req
  ): Promise<Voucher> {
    return this.voucherService.purchaseEntry(voucherDto, req.user.userId);
  }

  @Post("/journal")
  addJournal(
    @Body() voucherDto: VoucherEntryDto,
    @Request() req
  ): Promise<Voucher> {
    return this.voucherService.purchaseEntry(voucherDto, req.user.userId);
  }

  @Post("/contra")
  addContra(
    @Body() voucherDto: VoucherEntryDto,
    @Request() req
  ): Promise<Voucher> {
    return this.voucherService.contraEntry(voucherDto, req.user.userId);
  }

  @Post("/payment")
  addPayment(
    @Body() voucherDto: VoucherEntryDto,
    @Request() req
  ): Promise<Voucher> {
    return this.voucherService.paymentEntry(voucherDto, req.user.userId);
  }
}
