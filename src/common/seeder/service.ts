// seeder.service.ts
import { Injectable } from '@nestjs/common';
import { LedgerGroupSeed, LedgerSeed } from './all.seeder';
import { LedgerService } from 'src/ledgers/service/ledgers.service';
import { LedgerGroupService } from 'src/ledgers/service/ledger.group.service';

@Injectable()
export class SeederService {
    constructor(
        private readonly ledgerRepo: LedgerService,
        private readonly ledgerGroupRepo: LedgerGroupService,
    ) { }

    async seed() {
        for (let i = 0; i < 100; i++) {
            const entity1 = await this.ledgerGroupRepo.addGroup(LedgerGroupSeed(), "jdu0bmIKzYca");
            for (let j = 0; j < 5; j++) {
                await this.ledgerRepo.addLedger({ ...LedgerSeed(), ledger_group_id: entity1.id }, "jdu0bmIKzYca");
            }
        }
        console.log('Seed data inserted successfully.');
    }
}