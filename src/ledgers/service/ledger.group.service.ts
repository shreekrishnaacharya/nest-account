import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonEntity } from "src/common/trait/entity.trait";
import { Repository } from "typeorm";
import { LedgerGroupDto } from "../dto/ledger.groups.dto";
import { LedgerGroup } from "../entities/ledger.groups.entity";
import { BsHeadList } from "src/common/list/bshead.list";
import { BsHeads } from "src/common/enums/all.enum";
import { IPageable } from "src/common/models/pageable.interface";
import { Page } from "src/common/models/page.model";
import { IQueryDto } from "src/common/trait/query.dto";
import { LedgerGroupTypes } from "src/common/enums/ledger.group";

@Injectable()
export class LedgerGroupService extends CommonEntity<LedgerGroup> {
  constructor(
    @InjectRepository(LedgerGroup)
    private ledgerGroupRepository: Repository<LedgerGroup>
  ) {
    super(ledgerGroupRepository);
  }
  async addGroup(
    ledgerGroupDto: LedgerGroupDto,
    userId: string
  ): Promise<LedgerGroup> {
    const ledgerGroup = this.ledgerGroupRepository.create({
      name: ledgerGroupDto.name,
      // bs_head: ledgerGroupDto.bs_head,
      user_id: userId,
    });
    return await this.ledgerGroupRepository.save(ledgerGroup);
  }

  async getGroups(
    pageable: IPageable,
    groupSearchDto: IQueryDto
  ): Promise<Page<LedgerGroup>> {
    return this.findAllByPage(pageable, groupSearchDto);
  }

  async getGroupBsHead(): Promise<any> {
    return Object.values(BsHeads).map((e) => {
      return {
        value: e,
        label: e
      }
    });
  }

  async getGroupById(ledgerGroupId: string): Promise<LedgerGroup> {
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

  async updateGroup(
    ledgerGroupId: string,
    ledgerGroupDto: LedgerGroupDto
  ): Promise<LedgerGroup> {
    const ledgerGroupToUpdate = await this.getGroupById(ledgerGroupId);
    this.updateGroupProperties(ledgerGroupToUpdate, ledgerGroupDto);
    return this.ledgerGroupRepository.save(ledgerGroupToUpdate);
  }

  private updateGroupProperties(
    ledgerGroupToUpdate: LedgerGroup,
    ledgerGroupDto: LedgerGroupDto
  ) {
    const { name, bs_head } = ledgerGroupDto;
    ledgerGroupToUpdate.name = name;
    ledgerGroupToUpdate.bs_head = bs_head
  }

  async getLedgerGroupTypeId(group: LedgerGroupTypes): Promise<string> {
    return await this.ledgerGroupRepository.findOne({
      where: { group_type: group }
    }).then(e => e.id)
  }
}
