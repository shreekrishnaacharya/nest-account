import { ApiProperty } from "@nestjs/swagger";
import { BaseMinEntity } from "src/database/entities/base.min.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";

@Entity()
export class InvoiceItem extends BaseMinEntity {
  @ApiProperty()
  @Column("char", { length: 12 })
  invoice_id: string;

  @ApiProperty({ required: false })
  @Column("char", {
    length: 12,
    name: "ledger_id",
    nullable: true,
    default: null,
  })
  ledger_id: string;

  @ApiProperty()
  @Column()
  itemName: string;

  @ApiProperty()
  @Column()
  qty: number;

  @ApiProperty()
  @Column()
  rate: number;

  @ApiProperty()
  @Column()
  amount: number;

  // @ManyToOne(() => Invoice, (invoice: Invoice) => invoice.id,
  //   {
  //     onDelete: "CASCADE",
  //     lazy: true
  //   })
  // @JoinColumn({ name: 'invoice_id' })
  // invoice: () => Invoice;

  @BeforeUpdate()
  @BeforeInsert()
  public beforeInsertAndUpdate() {
    this.amount = this.rate * this.qty;
  }
}
