import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PayrollService } from "./service/payroll.service";
import { Payroll } from "./entities/payroll.entity";
import { PayrollDto } from "./dto/payroll.dto";
import { PayrollType } from "src/common/enums/all.enum";
import { ResponseMessage } from "src/common/models/response-message.model";
import { ResponseStatus } from "src/common/enums/response-status.enum";

@ApiTags("payroll")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("payroll")
export class PayrollController {
  constructor(private payrollService: PayrollService) { }

  @Get("/:employeeId")
  getPayroll(@Param("employeeId") employeeId: string): Promise<Payroll[]> {
    return this.payrollService.getPayroll(employeeId);
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
