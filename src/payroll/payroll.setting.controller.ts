import {
  Body,
  Controller,
  Get,
  Param,
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
import { PayrollSettingService } from "./service/payroll.setting.service";
import { PayrollSetting } from "./entities/payroll.setting.entity";
import { PayrollSettingPage } from "./dto/payroll.setting.response.dto";
import { PayrollSettingDto } from "./dto/payroll.setting.dto";

@ApiTags("payroll")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("payroll")
export class PayrollSettingController {
  constructor(private payrollService: PayrollSettingService) { }

  @ApiResponse({
    type: PayrollSettingPage,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Get("/")
  getPayrollSetting(
    @Query() pageDto: PageDto
  ): Promise<Page<PayrollSetting>> {
    const pageable: IPageable = PageRequest.from(pageDto);
    return this.payrollService.findAllByPage(pageable);
  }

  @Post("/")
  addPayrollSetting(
    @Body() payrollDto: PayrollSettingDto): ResponseMessage {
    this.payrollService.createSetting(payrollDto);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Payroll setting added successfully"
    }
  }

  @Put("/")
  updatePayroll(
    @Param("id") id: string,
    @Body() payrollDto: PayrollSettingDto): ResponseMessage {
    this.payrollService.updatePayroll(payrollDto, id);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Payroll setting added successfully"
    }
  }


}
