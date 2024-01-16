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
import { EmployeeSearchDto } from "src/employees/dto/employee.search.dto";
import { PayrollService } from "./service/payroll.service";
import { SalaryPost } from "src/common/interface/payrollVoucher";
import { PayrollPostService } from "./service/payroll.post.service";
import { MonthList, PayrollType, Status } from "src/common/enums/all.enum";
import { EmployeeSalaryPostPage } from "./dto/employee.post.response.dto";
import { EmployeePostSearchDto } from "./dto/employee.post.search.dto";
import { PayrollPostDto } from "./dto/payroll.post.dto";
import { ResponseMessage, ResponseStatus } from "src/common/enums/response-status.enum";
import { PayrollPost } from "./entities/payroll.post.entity";
import { PayrollEntryDto } from "./dto/payroll.entry.dto";

@ApiTags("payroll-post")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("payroll-post")
export class PostPayrollController {
  constructor(
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private payrollPostService: PayrollPostService
  ) { }

  @ApiResponse({
    type: EmployeeSalaryPostPage,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Get("/")
  async getEmployees(
    @Query("month") month: MonthList,
    @Query() employeeSearchDto: EmployeePostSearchDto,
    @Query() pageDto: PageDto
  ): Promise<EmployeeSalaryPostPage> {
    const pageable: IPageable = PageRequest.from(pageDto);
    const employeeList = await this.employeeService.findAllByPage(pageable, employeeSearchDto, [{ key: "status", value: Status.ACTIVE, clause: "=" }]);
    const empIds = employeeList.elements.map(e => e.id);
    const postList = await this.payrollPostService.getPostEmployeeByEmpIdAndMonth(empIds, month);
    const element = employeeList.elements.map((e, i) => {
      const post = postList.filter(k => (k.employee_id === e.id))
      if (post === undefined) {
        return { ...e, plus: [], minus: [] }
      } else {
        return { ...e, plus: post.filter(e => e.type === PayrollType.PLUS).map(e => e.amount), minus: post.filter(e => e.type === PayrollType.MINUS).map(e => e.amount) }
      }
    });
    return { ...employeeList, elements: [...element] }
  }

  @Post("/")
  createSalaryPost(
    @Body() payrollPostDto: PayrollPostDto,
    @Request() req): ResponseMessage {
    this.payrollPostService.createSalaryReleaseByEmployeeId(payrollPostDto, req.user.userId);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Payroll added successfully"
    }
  }

  @Post("/post/:employeeId")
  async postSalary(
    @Param("employeeId") employeeId: string,
    @Body() payrollEntryDto: PayrollEntryDto
  ): Promise<ResponseMessage> {
    console.log(payrollEntryDto)
    const result = await this.payrollPostService.createSalaryPostByEmployeeId(employeeId,payrollEntryDto, "jdu0bmIKzYca");
    if (result) {
      return {
        status: ResponseStatus.SUCCESS,
        message: "Payroll added successfully"
      }
    }
    return {
      status: ResponseStatus.ERROR,
      message: "Payroll not added"
    }
  }

  @Get("/history/:employeeId")
  getPostViewByEmpIdOrMonth(
    @Param("employeeId") employeeId: string,
    @Query("month") month: MonthList
  ): Promise<PayrollPost[]> {
    return this.payrollPostService.getPostEmployeeByEmpId(employeeId, month);
  }

  @Get("/:employeeId")
  getView(
    @Param("employeeId") employeeId: string
  ): Promise<SalaryPost> {
    return this.payrollService.getPayrollVoucherByEmployeeId(employeeId);
  }

}
