import { faker } from '@faker-js/faker';
import { LedgerGroup } from "src/ledgers/entities/ledger.groups.entity";
import { BsHeads, EmploymentType, Gender, Status } from '../enums/all.enum';
import { Ledger } from 'src/ledgers/entities/ledger.entity';
import { LedgerDto } from 'src/ledgers/dto/ledger.dto';
import { LedgerGroupDto } from 'src/ledgers/dto/ledger.groups.dto';
import { EmployeeDto } from 'src/employees/dto/employee.dto';

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

export function EmployeeSeed(): EmployeeDto {
    const employee: EmployeeDto = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        dob_en: toDateString(faker.date.birthdate()),
        dob_np: toDateString(faker.date.birthdate()),
        doj_np: toDateString(faker.date.birthdate()),
        doj_en: new Date(),
        phone1: faker.helpers.rangeToNumber({ min: 981000000, max: 984000000 }).toString(),
        phone2: faker.helpers.rangeToNumber({ min: 981000000, max: 984000000 }).toString(),
        gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
        employment: faker.helpers.arrayElement([EmploymentType.CONTRACT, EmploymentType.FULL_TIME, EmploymentType.TEMPORARY]),
        type: faker.helpers.arrayElement([
            'Permanent',
            'Temporary',
            'Intern',
            'Consultant',
        ]),
        bank_no: faker.finance.iban(),
        address1: faker.location.streetAddress(),
        address2: faker.location.secondaryAddress(),
        qualification: faker.person.jobTitle(),
        ledger_name: faker.internet.userName(),
        ledger_code: faker.internet.userName(),
        status: faker.helpers.arrayElement([Status.ACTIVE, Status.INACTIVE]),
    };
    return employee
}

function getRandomEnum(enumType): any {
    const enumValues = Object.values(enumType);
    return enumValues[Math.floor(Math.random() * enumValues.length)];
}

function toDateString(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1 to get the correct month number.
    const day = date.getDate();
    return `${year}-${(month.toString()).padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}