// seeder.service.ts
import { Injectable } from '@nestjs/common';
import { LedgerGroupSeed, LedgerSeed, EmployeeSeed } from './all.seeder';
import { LedgerService } from 'src/ledgers/service/ledgers.service';
import { LedgerGroupService } from 'src/ledgers/service/ledger.group.service';
import { EmployeeService } from 'src/employees/service/employee.service';

@Injectable()
export class SeederService {
    constructor(
        private readonly ledgerRepo: LedgerService,
        private readonly ledgerGroupRepo: LedgerGroupService,
        private readonly employeeService: EmployeeService,
    ) { }

    async seed() {
        console.log({ ...EmployeeSeed() })
        for (let i = 0; i < 100; i++) {
            const entity1 = await this.ledgerGroupRepo.addGroup(LedgerGroupSeed(), "jdu0bmIKzYca");
            for (let j = 0; j < 5; j++) {
                await this.ledgerRepo.addLedger({ ...LedgerSeed(), ledger_group_id: entity1.id }, "jdu0bmIKzYca");
            }

            await this.employeeService.addEmployee({ ...EmployeeSeed() }, "jdu0bmIKzYca")
        }
        console.log('Seed data inserted successfully.');
    }
}