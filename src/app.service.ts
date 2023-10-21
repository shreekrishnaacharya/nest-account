import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  async _hashPassword(password: string): Promise<string> {
    return await bcrypt.hashSync(password, 6);
  }
}
