import {
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Page } from "src/common/models/page.model";
import { CommonEntity } from "src/common/trait/entity.trait";
import { LedgerService } from "src/ledgers/service/ledgers.service";
import { Repository, In } from "typeorm";
import { IPageable } from "src/common/models/pageable.interface";
import { Employee } from "../entities/employee.entity";
import { EmployeeSearchDto } from "../dto/employee.search.dto";
import { EmployeeDto } from "../dto/employee.dto";
import { LedgerDto } from "src/ledgers/dto/ledger.dto";
import { LedgerGroupService } from "src/ledgers/service/ledger.group.service";
import { LedgerGroupTypes, LedgerTypes } from "src/common/enums/ledger.group";

@Injectable()
export class EmployeeService extends CommonEntity<Employee> {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @Inject(forwardRef(() => LedgerService))
    private ledgerService: LedgerService,
    @Inject(forwardRef(() => LedgerGroupService))
    private ledgerGroupService: LedgerGroupService
  ) {
    super(employeeRepository);
  }

  async getEmployeeById(
    employeeId: string
  ): Promise<Employee> {
    const emp = await this.employeeRepository.findOneOrFail({ relations: { ledger: true }, where: { id: employeeId } })
    return emp
  }

  async getAllActiveEmployee(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async getAllActiveEmployeesByIds(employeeIds: string[]): Promise<Employee[]> {
    return await this.employeeRepository.find({ where: { id: In(employeeIds) } });
  }

  async addEmployee(employeeDto: EmployeeDto, userId: string): Promise<Employee> {
    const ledgerDto = new LedgerDto;
    ledgerDto.ledger_group_id = await this.ledgerGroupService.getLedgerGroupTypeId(LedgerGroupTypes.EMPLOYEEE);
    ledgerDto.name = employeeDto.ledger_name
    ledgerDto.code = employeeDto.ledger_code
    ledgerDto.type = LedgerTypes.EMPLOYEE
    delete employeeDto["ledger_name"]
    delete employeeDto["ledger_code"]
    const ledgerModal = await this.ledgerService.addLedger(ledgerDto, userId || "jdu0bmIKzYca");
    const employee = this.employeeRepository.create({
      ...employeeDto,
      ledger_id: ledgerModal.id
    });
    return await this.employeeRepository.save(employee);
  }

  async updateEmployee(employeeId: string, employeeDto: EmployeeDto): Promise<Employee> {
    const employeeModal = await this.employeeRepository.findOneOrFail({ where: { id: employeeId } })
    const ledgerDto = new LedgerDto;
    ledgerDto.name = employeeDto.ledger_name
    ledgerDto.code = employeeDto.ledger_code
    delete employeeDto["ledger_name"]
    delete employeeDto["ledger_code"]
    await this.ledgerService.updateLedger(employeeModal.ledger_id, ledgerDto);
    const employee = this.employeeRepository.create({
      ...employeeModal,
      ...employeeDto
    });
    console.log(employee, employeeDto)
    return await this.employeeRepository.save(employee);
  }

  async updateEmployeeMonthlySalary(employeeId: string, plus: number, minus: number) {
    console.log(plus,minus)
    // const employeeModal = await this.employeeRepository.findOneOrFail({ where: { id: employeeId } })
    return await this.employeeRepository.update(employeeId, {
      amount_plus: plus,
      amount_minus: minus
    });
  }
}
