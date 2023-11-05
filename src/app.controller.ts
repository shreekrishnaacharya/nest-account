import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { SeederService } from "./common/seeder/service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, 
    private readonly seedService: SeederService
    ) { }

  @Get()
  getHello(): Promise<string> {
    return this.appService._hashPassword("krishna");
    // return this.appService.getHello();
  }

  @Get("seed")
  getSeed() {
    return this.seedService.seed();
  }
}
