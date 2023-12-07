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
import { EmployeeService } from "./service/employee.service";
import { EmployeePage } from "./dto/employee.response.dto";
import { EmployeeSearchDto } from "./dto/employee.search.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { Employee } from "./entities/employee.entity";

@ApiTags("employee")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("employee")
export class EmployeeController {
  constructor(private employeeService: EmployeeService) { }

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
    // return this.employeeService.getEmployees(pageable, employeeSearchDto);
    return this.employeeService.findAllByPage(pageable, employeeSearchDto);
  }

  @ApiResponse({
    type: EmployeeSearchDto,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Post("/")
  addEmployee(
    @Body() employeeDto: EmployeeDto,
    @Request() req
  ): Promise<Employee> {
    return this.employeeService.addEmployee(employeeDto, req.user.userId);
  }

  @Get("/:employeeId")
  getEmployeeById(
    @Param("employeeId") employeeId: string
  ): Promise<Employee> {
    return this.employeeService.getEmployeeById(employeeId);
  }

  @ApiResponse({
    type: Employee,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Patch("/:employeeId")
  update(
    @Param("employeeId") employeeId: string,
    @Body() employeeDto: EmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.updateEmployee(employeeId, employeeDto);
  }
}
