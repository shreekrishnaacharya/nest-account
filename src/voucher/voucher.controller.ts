import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PStatus } from "src/common/enums/all.enum";
import { TransformResponseInterceptor } from "src/common/inject/response";
import { PageRequest } from "src/common/models/page-request.model";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { VoucherCancelDto } from "./dto/voucher.cancel.dto";
import { VoucherEntryDto } from "./dto/voucher.entry.dto";
import { VoucherPage, VoucherResponseDto } from "./dto/voucher.response.dto";
import { VoucherSearchDto } from "./dto/voucher.search.dto";
import { VoucherCancel } from "./entities/voucher.cancel.entity";
import { VoucherService } from "./service/voucher.service";
import { PageDto } from "src/common/models/page.dto";
import { IPageable } from "src/common/models/pageable.interface";

@ApiTags("voucher")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("voucher")
export class VoucherController {
  constructor(private voucherService: VoucherService) { }

  @ApiResponse({
    type: VoucherPage,
  })
  @Get("/")
  @UseInterceptors(TransformResponseInterceptor<VoucherResponseDto>)
  getVouchers(
    @Query() voucherSearchDto: VoucherSearchDto,
    @Query() pageDto: PageDto
  ): Promise<VoucherPage> {
    const pageable: IPageable = PageRequest.from(pageDto);
    return this.voucherService.getVouchers(pageable, voucherSearchDto);
  }

  @ApiResponse({
    type: VoucherResponseDto,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Post("/purchase")
  addPurchase(
    @Body() voucherDto: VoucherEntryDto,
    @Request() req
  ): Promise<VoucherResponseDto> {
    return this.voucherService.purchaseEntry(voucherDto, req.user.userId);
  }
  @ApiResponse({
    type: VoucherResponseDto,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Post("/journal")
  addJournal(
    @Body() voucherDto: VoucherEntryDto,
    @Request() req
  ): Promise<VoucherResponseDto> {
    console.log(req.user, voucherDto)
    return this.voucherService.journalEntry(voucherDto, "jdu0bmIKzYca");
  }

  @ApiResponse({
    type: VoucherResponseDto,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Post("/contra")
  addContra(
    @Body() voucherDto: VoucherEntryDto,
    @Request() req
  ): Promise<VoucherResponseDto> {
    return this.voucherService.contraEntry(voucherDto, req.user.userId);
  }

  @ApiResponse({
    type: VoucherResponseDto,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Post("/payment")
  addPayment(
    @Body() voucherDto: VoucherEntryDto,
    @Request() req
  ): Promise<VoucherResponseDto> {
    console.log(voucherDto);
    return this.voucherService.paymentEntry(voucherDto, req.user.userId);
  }

  @Get("/cancel")
  getAllCancelVoucher(): Promise<VoucherCancel[]> {
    return this.voucherService.getAllCancelVoucher();
  }

  @Post("/cancel")
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  requestCancel(
    @Body() voucherCancelDto: VoucherCancelDto,
    @Request() req
  ): Promise<VoucherCancel> {
    return this.voucherService.addCancelVoucher(
      voucherCancelDto,
      req.user.userId
    );
  }

  @Get("/cancel/:id")
  getCancelVoucherById(@Param("id") id: string): Promise<VoucherCancel> {
    return this.voucherService.getCancelVoucherById(id);
  }

  @Put("/cancel/:id/status")
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  updateCancelVoucherStatus(
    @Param("id") id: string,
    @Body() status: PStatus
  ): Promise<any> {
    return this.voucherService.updateCancelVoucherStatus(id, status);
  }
}
