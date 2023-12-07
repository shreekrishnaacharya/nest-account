import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column } from "typeorm";
import { BaseMinEntity } from "./base.min.entity";

export abstract class BaseEntity extends BaseMinEntity {
  @ApiProperty({ type: Date })
  @Column({ name: "created_at", nullable: false, type: "timestamp" })
  public createdAt: Date;

  @ApiProperty({ type: Date })
  @Column({ name: "updated_at", nullable: false, type: "timestamp" })
  public updatedAt: Date;

  // @ApiProperty({ type: Date })
  // @Column({ name: "deleted_at", nullable: true, type: "timestamp" })
  // public deletedAt: Date;
  

  @BeforeInsert()
  public beforeInsert() {
    const now: Date = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  public BeforeUpdate() {
    const now: Date = new Date();
    this.updatedAt = now;
  }
}
