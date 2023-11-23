import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PageRequest } from "src/common/models/page-request.model";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { LedgerDto } from "./dto/ledger.dto";
import { LedgerPage } from "./dto/ledger.response.dto";
import { LedgerSearchDto } from "./dto/ledger.search.dto";
import { Ledger } from "./entities/ledger.entity";
import { LedgerService } from "./service/ledgers.service";
import { IPageable } from "src/common/models/pageable.interface";
import { PageDto } from "src/common/models/page.dto";

@ApiTags("ledger")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("ledger")
export class LedgersController {
  constructor(
    private ledgerService: LedgerService,
  ) { }

  @ApiResponse({
    type: LedgerPage,
  })
  @Get("/")
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  getLedgers(
    @Query() ledgerSearchDto: LedgerSearchDto,
    @Query() pageDto: PageDto,
  ): Promise<LedgerPage> {
    const pageable: IPageable = PageRequest.from(pageDto);
    return this.ledgerService.getLedgers(pageable, ledgerSearchDto);
  }

  @Post("/")
  addLedger(@Body() ledgerDto: LedgerDto, @Request() req): Promise<Ledger> {
    const _user = req.user;
    return this.ledgerService.addLedger(ledgerDto, _user.userId);
  }

  @Get("/:ledgerId")
  getLedgerById(
    @Param("ledgerId") ledgerId: string
  ): Promise<Ledger> {
    return this.ledgerService.getLedgerById(ledgerId);
  }

  @Patch("/:ledgerId")
  @Put("/:ledgerId")
  updateLedger(
    @Body() ledgerGroupDto: LedgerDto,
    @Param("ledgerId") ledgerId: string
  ): Promise<Ledger> {
    return this.ledgerService.updateLedger(ledgerId, ledgerGroupDto);
  }

  @Put("/:ledgerId/state")
  updateLedgerStatus(@Param("groupId") ledgerId: string): Promise<Ledger> {
    return this.ledgerService.updateLedgerStatus(ledgerId);
  }
}
