import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppService } from "./app.service";
import { RedisService } from "./config/redis.service";
import { EnvConsolidatedData } from "./entities/env-consolidated-data.entity";

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "mysql",
      port: 3306,
      username: "bh",
      password: "bh",
      database: "bh",
      entities: [EnvConsolidatedData],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([EnvConsolidatedData]),
  ],
  providers: [AppService, RedisService],
})
export class AppModule {}
