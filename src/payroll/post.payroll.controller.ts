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
import { PageDto } from "src/common/models/page.dto";
import { IPageable } from "src/common/models/pageable.interface";
import { EmployeeService } from "src/employees/service/employee.service";
import { EmployeePage } from "src/employees/dto/employee.response.dto";
import { EmployeeSearchDto } from "src/employees/dto/employee.search.dto";
import { PayrollService } from "./service/payroll.service";
import { SalaryPost, SalaryVoucher } from "src/common/interface/payrollVoucher";

@ApiTags("post-payroll")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("post-payroll")
export class PostPayrollController {
  constructor(
    private employeeService: EmployeeService,
    private payrollService: PayrollService
  ) { }

  @ApiResponse({
    type: EmployeePage,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Get("/")
  getEmployees(
    @Query() employeeSearchDto: EmployeeSearchDto,
    @Query() pageDto: PageDto
  ): Promise<EmployeePage> {
    const pageable: IPageable = PageRequest.from(pageDto);
    return this.employeeService.getEmployees(pageable, employeeSearchDto);
  }

  @Get("/:employeeId")
  getView(
    @Param("employeeId") employeeId: string
  ): Promise<SalaryPost> {
    return this.payrollService.getPayrollVoucherByEmployeeId(employeeId);
  }

}
