import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { YesNo } from "src/common/enums/all.enum";
import { Repository } from "typeorm";
import { FiscalYearDto } from "./dto/fiscal.year.dto";
import { FiscalYear } from "./entities/fiscal.year.entity";

@Injectable()
export class FiscalYearService {
  constructor(
    @InjectRepository(FiscalYear)
    private fiscalYearRepository: Repository<FiscalYear>
  ) {}
  async updateFiscalYear(
    fiscalYearId: string,
    fiscalYearDto: FiscalYearDto
  ): Promise<FiscalYear> {
    const fiscalYear = await this.getFiscalYearById(fiscalYearId);
    this.updateFiscalProperties(fiscalYear, fiscalYearDto);
    return await this.fiscalYearRepository.save(fiscalYear);
  }

  async getFiscalYears(): Promise<FiscalYear[]> {
    const fiscalYears = await this.fiscalYearRepository.find({
      order: {
        id: "DESC",
      },
    });
    return fiscalYears;
  }

  async getCurrentYear(): Promise<FiscalYear> {
    const fiscalYears = await this.fiscalYearRepository.findOne({
      where: { is_closed: YesNo.NO },
    });
    return fiscalYears;
  }

  async getFiscalYearById(fiscalYearId: string): Promise<FiscalYear> {
    const fiscalYear = await this.fiscalYearRepository.findOne({
      where: {
        id: fiscalYearId,
      },
    });
    if (!fiscalYear) {
      throw new NotFoundException();
    }
    return fiscalYear;
  }

  private updateFiscalProperties(
    fiscalYearUpdate: FiscalYear,
    fiscalYearDto: FiscalYearDto
  ) {
    const { name, openingDateEn, openingDateNp, closingDateEn, closingDateNp } =
      fiscalYearDto;
    fiscalYearUpdate.name = name;
    fiscalYearUpdate.opening_en = openingDateEn;
    fiscalYearUpdate.closing_en = closingDateEn;
    fiscalYearUpdate.opening_np = openingDateNp;
    fiscalYearUpdate.closing_np = closingDateNp;
  }
}
