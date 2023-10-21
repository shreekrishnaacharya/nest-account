import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../database/entities/base.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class RefreshToken extends BaseEntity {
  @Column("char", { length: 12, name: "user_id" })
  public user_id: string;

  @Column({ nullable: false, name: "refresh_token" })
  public refreshToken: string;

  @Column({ nullable: false, name: "is_blacklisted", default: false })
  public isBlacklisted: boolean;

  @ManyToOne((type) => User, (user) => user.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "user_id" })
  public user: () => User;
}
