import { ApiProperty } from "@nestjs/swagger";
import { Page } from "src/common/models/page.model";
import { Employee } from "src/employees/entities/employee.entity";

interface EmployeePost {
  plus: number[]
  minus: number[]
}

class EmployeePostClass extends Employee {
  plus: number[]
  minus: number[]
}

export class EmployeeSalaryPostPage extends Page<EmployeePost> {
  @ApiProperty({ type: [EmployeePostClass] })
  public elements: EmployeePost[];
}

