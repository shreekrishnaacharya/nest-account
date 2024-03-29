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
import { PayrollSettingSearchDto } from "./dto/payroll.setting.search.dto";

@ApiTags("payroll-setting")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("payroll-setting")
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
    @Query() payrollSearchDto: PayrollSettingSearchDto,
    @Query() pageDto: PageDto
  ): Promise<Page<PayrollSetting>> {
    const pageable: IPageable = PageRequest.from(pageDto);
    return this.payrollService.findAllByPage(pageable, payrollSearchDto);
  }

  @ApiResponse({
    type: PayrollSettingDto,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Post("/")
  addPayrollSetting(
    @Body() payrollDto: PayrollSettingDto): Promise<PayrollSetting> {
    return this.payrollService.createSetting(payrollDto);
    // return {
    //   status: ResponseStatus.SUCCESS,
    //   message: "Payroll setting added successfully"
    // }
  }

  @Get("/:id")
  getPayroll(
    @Param("id") id: string): Promise<PayrollSetting> {
    return this.payrollService.getOnePayrollSetting(id);
  }

  @ApiResponse({
    type: PayrollSettingDto,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  @Patch("/:id")
  updatePayroll(
    @Param("id") id: string,
    @Body() payrollDto: PayrollSettingDto): ResponseMessage {
    this.payrollService.updateSetting(payrollDto, id);
    return {
      status: ResponseStatus.SUCCESS,
      message: "Payroll setting added successfully"
    }
  }

  @Delete("/:id")
  deletePayroll(
    @Param("id") id: string): ResponseMessage {
    if (this.payrollService.deletePayroll(id)) {
      return {
        status: ResponseStatus.SUCCESS,
        message: "Payroll setting deleted successfully"
      }
    } else {
      return {
        status: ResponseStatus.ERROR,
        message: "Payroll setting delete failed"
      }
    }
  }

}
