import { ApiProperty } from "@nestjs/swagger";
import { Generator } from "src/common/helpers/id.generator";
import { BeforeInsert, Column, PrimaryColumn } from "typeorm";

export abstract class BaseMinEntity {
  @ApiProperty()
  @PrimaryColumn("char", { length: 12 })
  id: string;

  // @ApiProperty()
  @Column("char", { length: 12, default: 1 })
  account_id: string;

  @BeforeInsert()
  generateCustomPrimaryKey() {
    this.id = Generator.getId();
  }


}
