import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RedisService } from "./config/redis.service";
import { EP1Service } from "./devices/ep1.service";
import { EP2Service } from "./devices/ep2.service";
import { Env1Service } from "./devices/env1.service";

@Module({
  controllers: [AppController],
  providers: [AppService, RedisService, EP1Service, EP2Service, Env1Service],
})
export class AppModule {}
