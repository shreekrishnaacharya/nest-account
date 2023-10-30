import { ApiProperty } from "@nestjs/swagger";
import { Page } from "src/common/models/page.model";
import { Employee } from "../entities/employee.entities";

export class EmployeePage extends Page<Employee> {
  @ApiProperty({ type: [Employee] })
  public elements: Employee[];
}

