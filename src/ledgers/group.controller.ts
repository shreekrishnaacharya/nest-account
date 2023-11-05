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
import { LedgerGroupDto } from "./dto/ledger.groups.dto";
import { LedgerGroup } from "./entities/ledger.groups.entity";
import { LedgerGroupService } from "./service/ledger.group.service";
import { IPageable } from "src/common/models/pageable.interface";
import { PageDto } from "src/common/models/page.dto";
import { Page } from "src/common/models/page.model";
import { GroupSearchDto } from "./dto/group.search.dto";

@ApiTags("ledger-group")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("ledger-group")
export class LedgerGroupController {
  constructor(
    private ledgerGroupService: LedgerGroupService
  ) { }

  @Get("/")
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  getGroups(
    @Query() groupSearchDto: GroupSearchDto,
    @Query() pageDto: PageDto,
  ): Promise<Page<LedgerGroup>> {
    const pageable: IPageable = PageRequest.from(pageDto);
    return this.ledgerGroupService.getGroups(pageable, groupSearchDto);
  }

  @Get("/bshead")
  getGroupBsHead(): Promise<any> {
    return this.ledgerGroupService.getGroupBsHead();
  }

  @Get("/:groupId")
  getGroupById(
    @Param("groupId") groupId: string
  ): Promise<LedgerGroup> {
    return this.ledgerGroupService.getGroupById(groupId);
  }

  @Post("/")
  addGroup(
    @Body() ledgerGroupDto: LedgerGroupDto,
    @Request() req
  ): Promise<LedgerGroup> {
    const _user = req.user;
    console.log(ledgerGroupDto)
    return this.ledgerGroupService.addGroup(ledgerGroupDto, _user.userId);
  }

  @Patch("/:groupId")
  @Put("/:groupId")
  updateGroup(
    @Body() ledgerGroupDto: LedgerGroupDto,
    @Param("groupId") groupId: string
  ): Promise<LedgerGroup> {
    console.log(ledgerGroupDto);
    return this.ledgerGroupService.updateGroup(groupId, ledgerGroupDto);
  }

}
