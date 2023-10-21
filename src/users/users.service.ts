import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { ResponseStatus } from "src/common/enums/response-status.enum";
import { ResponseMessage } from "src/common/models/response-message.model";
import { Raw, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  public async findByEmail(email: string): Promise<User | undefined> {
    return (
      await this.usersRepository.find({
        // relations: ['account'],
        where: { email },
        take: 1,
      })
    )[0];
  }

  public async findByEmailPhone(email: string): Promise<User | undefined> {
    return (
      await this.usersRepository.find({
        // relations: ['account'],
        where: [{ email: email }, { phone: email }],
        take: 1,
      })
    )[0];
  }

  public async findByPhone(phone: string): Promise<User | undefined> {
    return (
      await this.usersRepository.find({
        // relations: ['account'],
        where: { phone },
        take: 1,
      })
    )[0];
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  public async passwordResetFromResetToken(
    password: string,
    resetToken: string
  ): Promise<ResponseMessage> {
    const user: User = await this.usersRepository.findOne({
      where: {
        resetToken: resetToken,
        resetTokenExpiration: Raw((alias) => `${alias} > NOW()`),
      },
    });

    if (!user) {
      return {
        status: ResponseStatus.ERROR,
        message: `Invalid or expired reset code.`,
      };
    }

    user.password = await this._hashPassword(password);
    user.resetToken = uuidv4();
    this.usersRepository.save(user);

    return {
      status: ResponseStatus.SUCCESS,
      message: `Your password was successfully changed!`,
    } as ResponseMessage;
  }

  public async passwordRequestReset(email: string): Promise<ResponseMessage> {
    const user: User = await this.usersRepository.findOne({
      // relations: ['account'],
      where: { email: email },
    });

    user.resetToken = uuidv4();
    user.resetTokenExpiration = this._generateResetTokenExpiration();
    this.usersRepository.save(user);
    // this._emailerService.sendPasswordResetEmail(email, user.resetToken);

    return {
      status: ResponseStatus.SUCCESS,
      message: `You should receive an email with a reset link shortly!`,
    } as ResponseMessage;
  }

  private _generateResetTokenExpiration(): Date {
    const now: Date = new Date();
    now.setMinutes(now.getMinutes() + 10);
    return now;
  }

  private async _hashPassword(password: string): Promise<string> {
    return await bcrypt.hashSync(password, 6);
  }
}
