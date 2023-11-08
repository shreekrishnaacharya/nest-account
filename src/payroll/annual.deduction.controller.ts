import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ResponseMessage } from "src/common/models/response-message.model";
import { ResponseStatus } from "src/common/enums/response-status.enum";
import { PageDto } from "src/common/models/page.dto";
import { Page } from "src/common/models/page.model";
import { IPageable } from "src/common/models/pageable.interface";
import { PageRequest } from "src/common/models/page-request.model";
import { AnnualDeductionService } from "./service/annual.deduction.service";
import { AnnualDeductionPage } from "./dto/annual.deduction.response.dto";
import { AnnualDeductionDto } from "./dto/annual.deduction.dto";
import { AnnualDeduction } from "./entities/annual.deduction";
import { AnnualDeductionSearchDto } from "./dto/annual.deduction.search.dto";
import { IQueryClause } from "src/common/trait/query.dto";

@ApiTags("annual-deduction")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("annual-deduction")
export class AnnualDeductionController {
  constructor(private annualDeductionService: AnnualDeductionService) { }

  @ApiResponse({
    type: AnnualDeductionPage,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Get("/:employeeId")
  getAnnualDeduction(
    @Param("employeeId") employeeId: string,
    @Query() annualDeductionDto: AnnualDeductionSearchDto,
    @Query() pageDto: PageDto
  ): Promise<Page<AnnualDeduction>> {
    const pageable: IPageable = PageRequest.from(pageDto);
    const condition: IQueryClause = {
      key: "employee_id",
      value: employeeId,
      clause: "AND"
    }
    return this.annualDeductionService.findAllByPage(pageable, annualDeductionDto, [condition]);
  }

  @ApiResponse({
    type: AnnualDeductionDto,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Post("/:employeeId")
  addAnnualDeduction(
    @Param("employeeId") employeeId: string,
    @Body() payrollDto: AnnualDeductionDto): Promise<AnnualDeduction> {
    return this.annualDeductionService.createSetting(payrollDto);
    // return {
    //   status: ResponseStatus.SUCCESS,
    //   message: "Payroll setting added successfully"
    // }
  }

  @Get("/:id")
  getPayroll(
    @Param("id") id: string): Promise<AnnualDeduction> {
    return this.annualDeductionService.getOneAnnualDeduction(id);
  }

  @ApiResponse({
    type: AnnualDeductionDto,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Patch("/:id")
  updatePayroll(
    @Param("id") id: string,
    @Body() annualDeductionDtoDto: AnnualDeductionDto): ResponseMessage {
    this.annualDeductionService.updatePayroll(annualDeductionDtoDto, id);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Annual deduction added successfully"
    }
  }


}
