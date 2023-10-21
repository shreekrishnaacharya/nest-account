import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { InvoiceDto } from "./dto/invoice.dto";
import { Invoice } from "./entities/invoice.entity";
import { InvoiceService } from "./service/invoice.service";

@ApiTags("invoice")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("invoice")
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get("/")
  getInvoices(): Promise<Invoice[]> {
    return this.invoiceService.getInvoices();
  }

  @Post("/")
  addInvoice(@Body() invoiceDto: InvoiceDto, @Request() req): Promise<Invoice> {
    return this.invoiceService.createInvoice(invoiceDto, req.users.id);
  }

  @Get("/:invoiceId")
  getInvoiceById(@Param("invoiceId") invoiceId: string): Promise<Invoice> {
    return this.invoiceService.getInvoiceById(invoiceId);
  }
}
