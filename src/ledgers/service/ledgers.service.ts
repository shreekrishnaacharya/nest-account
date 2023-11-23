import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Status } from "src/common/enums/all.enum";
import { PageRequest } from "src/common/models/page-request.model";
import { Page } from "src/common/models/page.model";
import { CommonEntity } from "src/common/trait/entity.trait";
import { In, Repository } from "typeorm";
import { LedgerDto } from "../dto/ledger.dto";
import { LedgerSearchDto } from "../dto/ledger.search.dto";
import { Ledger } from "../entities/ledger.entity";
import { IPageable } from "src/common/models/pageable.interface";
import { IQueryDto } from "src/common/trait/query.dto";
import { LedgerGroupTypes } from "src/common/enums/ledger.group";

@Injectable()
export class LedgerService extends CommonEntity<Ledger> {
  constructor(
    @InjectRepository(Ledger)
    private ledgerRepository: Repository<Ledger>
  ) {
    super(ledgerRepository);
  }

  async addLedger(ledgerDto: LedgerDto, userId: string): Promise<Ledger> {
    const ledger = this.ledgerRepository.create({
      ...ledgerDto,
      user_id: userId,
    });
    console.log(ledger)
    return await this.ledgerRepository.save(ledger);
  }

  async getLedgers(
    pageable: IPageable,
    ledgerSearchDto: IQueryDto
  ): Promise<Page<Ledger>> {
    return this.findAllByPage(pageable, ledgerSearchDto);
  }


  async getLedgerByIds(ledgerIds: Array<string>): Promise<Ledger[]> {
    const ledgers = await this.ledgerRepository.find({
      where: { id: In(ledgerIds) },
      order: {
        id: "DESC",
      },
    });
    return ledgers;
  }

  async getLedgerById(ledgerId: string): Promise<Ledger> {
    const ledger = await this.ledgerRepository.findOne({
      where: {
        id: ledgerId,
      },
    });
    if (!ledger) {
      throw new NotFoundException();
    }
    return ledger;
  }

  async updateLedger(ledgerId: string, ledgerDto: LedgerDto): Promise<Ledger> {
    const ledgerUpdate = await this.getLedgerById(ledgerId);
    this.updateLedgerProperties(ledgerUpdate, ledgerDto);
    return this.ledgerRepository.save(ledgerUpdate);
  }

  async updateLedgerStatus(ledgerId: string): Promise<Ledger> {
    const ledgerToUpdate = await this.getLedgerById(ledgerId);
    if (ledgerToUpdate.status === Status.ACTIVE) {
      ledgerToUpdate.status = Status.INACTIVE;
    } else {
      ledgerToUpdate.status = Status.ACTIVE;
    }
    return this.ledgerRepository.save(ledgerToUpdate);
  }

  private updateLedgerProperties(ledgerToUpdate: Ledger, ledgerDto: LedgerDto) {
    const { name, ledger_group_id, code, type } = ledgerDto;
    ledgerToUpdate.name = name;
    ledgerToUpdate.ledger_group_id = ledger_group_id;
    ledgerToUpdate.code = code;
    ledgerToUpdate.type = type
  }


}
