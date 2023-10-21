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
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PageRequest } from "src/common/models/page-request.model";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { LedgerDto } from "./dto/ledger.dto";
import { LedgerGroupDto } from "./dto/ledger.groups.dto";
import { LedgerPage } from "./dto/ledger.response.dto";
import { LedgerSearchDto } from "./dto/ledger.search.dto";
import { Ledger } from "./entities/ledger.entity";
import { LedgerGroup } from "./entities/ledger.groups.entity";
import { LedgerGroupService } from "./service/ledger.group.service";
import { LedgerService } from "./service/ledgers.service";

@ApiTags("ledger")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("ledger")
export class LedgersController {
  constructor(
    private ledgerService: LedgerService,
    private ledgerGroupService: LedgerGroupService
  ) {}

  @ApiResponse({
    type: LedgerPage,
  })
  @Get("/")
  getLedgers(
    @Query() ledgerSearchDto: LedgerSearchDto,
    @Query() pageRequest: PageRequest
  ): Promise<LedgerPage> {
    return this.ledgerService.getLedgers(pageRequest, ledgerSearchDto);
  }

  @Post("/")
  addLedger(@Body() ledgerDto: LedgerDto, @Request() req): Promise<Ledger> {
    const _user = req.user;
    return this.ledgerService.addLedger(ledgerDto, _user.userId);
  }

  @Put("/:ledgerId")
  updateGroup(
    @Body() ledgerGroupDto: LedgerDto,
    @Param("ledgerId") ledgerId: string
  ): Promise<Ledger> {
    return this.ledgerService.updateLedger(ledgerId, ledgerGroupDto);
  }

  @Put("/:ledgerId/state")
  updateLedgerStatus(@Param("groupId") ledgerId: string): Promise<Ledger> {
    return this.ledgerService.updateLedgerStatus(ledgerId);
  }

  @Get("group")
  getLedgerGroups(): Promise<LedgerGroup[]> {
    return this.ledgerGroupService.getLedgerGroups();
  }

  @Post("group")
  addLedgerGroup(
    @Body() ledgerGroupDto: LedgerGroupDto,
    @Request() req
  ): Promise<LedgerGroup> {
    const _user = req.user;
    console.log(_user);
    return this.ledgerGroupService.addLedgerGroup(ledgerGroupDto, _user.userId);
  }

  @Put("group/:groupId")
  updateLedgerGroup(
    @Body() ledgerGroupDto: LedgerGroupDto,
    @Param("groupId") groupId: string
  ): Promise<LedgerGroup> {
    return this.ledgerGroupService.updateLedgerGroup(groupId, ledgerGroupDto);
  }
}
