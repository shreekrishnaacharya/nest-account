import {
  Body,
  Controller,
  Delete,
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
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PayrollService } from "./service/payroll.service";
import { Payroll } from "./entities/payroll.entity";
import { PayrollDto } from "./dto/payroll.dto";
import { ResponseMessage } from "src/common/models/response-message.model";
import { ResponseStatus } from "src/common/enums/response-status.enum";
import { PayrollPage } from "./dto/payroll.response.dto";
import { PageDto } from "src/common/models/page.dto";
import { PayrollSearchDto } from "./dto/payroll.search.dto";
import { Page } from "src/common/models/page.model";
import { IPageable } from "src/common/models/pageable.interface";
import { PageRequest } from "src/common/models/page-request.model";
import { PayrollCreateDto } from "./dto/payroll.create.dto";

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
    @Body() payrollDto: PayrollCreateDto): ResponseMessage {
    // console.log(payrollDto)
    this.payrollService.createPayroll(payrollDto, employeeId);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Payroll added successfully"
    }
  }

  @Get("summary/:employeeId")
  getSummary(
    @Param("employeeId") employeeId: string) {
    // console.log(payrollDto)
    return this.payrollService.getSummary(employeeId);
  }

  @Get("post/:employeeId")
  getPostList(@Param("employeeId") employeeId: string) {
    return this.payrollService.getPayrollVoucherByEmployeeId(employeeId)
  }

  @Get("/:employeeId/:payrollId")
  getOnePayroll(
    @Param("payrollId") payrollId: string): Promise<Payroll> {
    return this.payrollService.getOnePayroll(payrollId);
  }

  @Patch("/:employeeId/:payrollId")
  updatePayroll(
    @Param("payrollId") payrollId: string,
    @Param("employeeId") employeeId: string,
    @Body("amount") amount: number): ResponseMessage {
    this.payrollService.updatePayroll(payrollId, amount, employeeId);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Payroll added successfully"
    }
  }

  @Delete("/:employeeId/:payrollId")
  deletePayroll(
    @Param("payrollId") payrollId: string): ResponseMessage {
    console.log(payrollId)
    this.payrollService.deletePayroll(payrollId);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Payroll deleted successfully"
    }
  }

}
