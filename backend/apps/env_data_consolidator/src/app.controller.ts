import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern()
  async handleMessage(@Payload() data: any) {
    await this.appService.processMessage(data);
  }
}
