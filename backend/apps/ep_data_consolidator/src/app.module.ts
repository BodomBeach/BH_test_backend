import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppService } from "./app.service";
import { RedisService } from "./config/redis.service";
import { EPConsolidatedData } from "./entities/ep-consolidated-data.entity";

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
      entities: [EPConsolidatedData],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([EPConsolidatedData]),
  ],
  providers: [AppService, RedisService],
})
export class AppModule {}
