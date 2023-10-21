import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonEntity } from "src/common/trait/entity.trait";
import { Repository } from "typeorm";
import { LedgerGroupDto } from "../dto/ledger.groups.dto";
import { LedgerGroup } from "../entities/ledger.groups.entity";

@Injectable()
export class LedgerGroupService extends CommonEntity<LedgerGroup> {
  constructor(
    @InjectRepository(LedgerGroup)
    private ledgerGroupRepository: Repository<LedgerGroup>
  ) {
    super(ledgerGroupRepository);
  }
  async addLedgerGroup(
    ledgerGroupDto: LedgerGroupDto,
    userId: string
  ): Promise<LedgerGroup> {
    const ledgerGroup = this.ledgerGroupRepository.create({
      ...ledgerGroupDto,
      user_id: userId,
    });
    console.log(ledgerGroup);
    return await this.ledgerGroupRepository.save(ledgerGroup);
  }

  async getLedgerGroups(): Promise<LedgerGroup[]> {
    const ledgerGroups = await this.ledgerGroupRepository.find({
      order: {
        id: "DESC",
      },
    });
    return ledgerGroups;
  }

  async getLedgerGroupById(ledgerGroupId: string): Promise<LedgerGroup> {
    const ledgerGroup = await this.ledgerGroupRepository.findOne({
      where: {
        id: ledgerGroupId,
      },
    });
    if (!ledgerGroup) {
      throw new NotFoundException();
    }
    return ledgerGroup;
  }

  async updateLedgerGroup(
    ledgerGroupId: string,
    ledgerGroupDto: LedgerGroupDto
  ): Promise<LedgerGroup> {
    const ledgerGroupToUpdate = await this.getLedgerGroupById(ledgerGroupId);
    this.updateLedgerGroupProperties(ledgerGroupToUpdate, ledgerGroupDto);
    return this.ledgerGroupRepository.save(ledgerGroupToUpdate);
  }

  private updateLedgerGroupProperties(
    ledgerGroupToUpdate: LedgerGroup,
    ledgerGroupDto: LedgerGroupDto
  ) {
    const { name } = ledgerGroupDto;
    ledgerGroupToUpdate.name = name;
  }
}
