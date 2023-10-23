import { faker } from '@faker-js/faker';
import { LedgerGroup } from "src/ledgers/entities/ledger.groups.entity";
import { BsHeads } from '../enums/all.enum';
import { Ledger } from 'src/ledgers/entities/ledger.entity';
import { LedgerDto } from 'src/ledgers/dto/ledger.dto';
import { LedgerGroupDto } from 'src/ledgers/dto/ledger.groups.dto';

export function LedgerGroupSeed(): LedgerGroupDto {
    const entity = new LedgerGroupDto();
    entity.name = faker.internet.userName()
    entity.bs_head = getRandomEnum(BsHeads);
    return entity;
}

export function LedgerSeed(): LedgerDto {
    const entity = new LedgerDto();
    entity.name = faker.internet.userName()
    entity.code = faker.internet.userName()
    return entity;
}

function getRandomEnum(enumType): any {
    const enumValues = Object.values(enumType);
    return enumValues[Math.floor(Math.random() * enumValues.length)];
}