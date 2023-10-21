import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FiscalYearDto } from "./dto/fiscal.year.dto";
import { FiscalYear } from "./entities/fiscal.year.entity";
import { FiscalYearService } from "./fiscalyear.service";

@ApiTags("fiscal-year")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("fiscal-year")
export class FiscalYearController {
  constructor(private fiscalYearService: FiscalYearService) {}

  @Get("/")
  getLedgers(): Promise<FiscalYear[]> {
    return this.fiscalYearService.getFiscalYears();
  }

  @Put("/:fiscalYearId")
  updateGroup(
    @Body() fiscalYearDto: FiscalYearDto,
    @Param("fiscalYearId") fiscalYearId: string
  ): Promise<FiscalYear> {
    return this.fiscalYearService.updateFiscalYear(fiscalYearId, fiscalYearDto);
  }
}
