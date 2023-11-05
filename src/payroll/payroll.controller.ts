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
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PayrollService } from "./service/payroll.service";
import { Payroll } from "./entities/payroll.entity";
import { PayrollDto } from "./dto/payroll.dto";
import { PayrollType } from "src/common/enums/all.enum";
import { ResponseMessage } from "src/common/models/response-message.model";
import { ResponseStatus } from "src/common/enums/response-status.enum";
import { PayrollPage } from "./dto/payroll.response.dto";
import { PageDto } from "src/common/models/page.dto";
import { PayrollSearchDto } from "./dto/payroll.search.dto";
import { Page } from "src/common/models/page.model";
import { IPageable } from "src/common/models/pageable.interface";
import { PageRequest } from "src/common/models/page-request.model";

@ApiTags("payroll")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("payroll")
export class PayrollController {
  constructor(private payrollService: PayrollService) { }


  @ApiResponse({
    type: PayrollPage,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Get("/:employeeId")
  getPayroll(
    @Param("employeeId") employeeId: string,
    @Query() payrollSearchDto: PayrollSearchDto,
    @Query() pageDto: PageDto
  ): Promise<Page<Payroll>> {
    const pageable: IPageable = PageRequest.from(pageDto);
    payrollSearchDto.employee_id = employeeId
    return this.payrollService.findAllByPage(pageable, payrollSearchDto);
  }

  @Post("/:employeeId")
  addPayroll(
    @Param("employeeId") employeeId: string,
    @Body() payrollDto: PayrollDto[]): ResponseMessage {
    this.payrollService.createPayroll(payrollDto, employeeId, PayrollType.PLUS);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Payroll added successfully"
    }
  }

  @Put("/:employeeId")
  updatePayroll(
    @Param("employeeId") employeeId: string,
    @Body() payrollDto: PayrollDto[]): ResponseMessage {
    this.payrollService.updatePayroll(payrollDto, employeeId, PayrollType.PLUS);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Payroll added successfully"
    }
  }


}