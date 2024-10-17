import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { RedisService } from "./config/redis.service";
import { ScheduleModule } from "@nestjs/schedule";
import { RabbitMQModule } from "./config/rabbitmq/rabbitmq.module";

@Module({
  imports: [ScheduleModule.forRoot(), RabbitMQModule],
  providers: [AppService, RedisService],
})
export class AppModule {}
