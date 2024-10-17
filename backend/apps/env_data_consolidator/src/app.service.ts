import { Injectable } from "@nestjs/common";
import { RedisService } from "./config/redis.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EnvConsolidatedData } from "./entities/env-consolidated-data.entity";

@Injectable()
export class AppService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(EnvConsolidatedData)
    private readonly consolidatedDataRepository: Repository<EnvConsolidatedData>
  ) {}

  async processMessage(data: any) {
    const timestamp = data.timestamp;
    const deviceId = data.deviceId;

    console.log(
      `Processing message for deviceId: ${deviceId} at timestamp: ${timestamp}`
    );

    // Get the last emptying timestamp (filling_level == 0)
    const lastVidage = await this.redisService.getLastVidageTimestamp(deviceId);
    if (!lastVidage) {
      console.log(`No emptying detected for deviceId: ${deviceId}`);
      return;
    }

    const startTime = lastVidage;
    const endTime = timestamp;

    // Get filling level data from Redis for the time range
    const dataInRange = await this.redisService.getDataInRange(
      deviceId,
      startTime,
      endTime
    );

    if (!dataInRange || dataInRange.length === 0) {
      console.log(
        `No data found for deviceId: ${deviceId} in range [${startTime}, ${endTime}]`
      );
      return;
    }

    // Calculate the total filling change and the average speed of filling (delta level / time)
    let totalFillingChange = 0;
    let totalDuration = 0;
    for (let i = 1; i < dataInRange.length; i++) {
      const previousData = dataInRange[i - 1];
      const currentData = dataInRange[i];

      const fillingChange =
        currentData.filling_level - previousData.filling_level;
      const duration = currentData.timestamp - previousData.timestamp;

      totalFillingChange += fillingChange;
      totalDuration += duration;
    }

    const averageFillingSpeed =
      totalDuration > 0 ? totalFillingChange / totalDuration : 0;

    // Create and save the consolidated data to MySQL
    const consolidatedData = new EnvConsolidatedData();
    consolidatedData.deviceId = deviceId;
    consolidatedData.timestamp = timestamp;
    consolidatedData.averageFillingSpeed = averageFillingSpeed;

    await this.consolidatedDataRepository.save(consolidatedData);
    console.log(
      `Consolidated data saved for deviceId: ${deviceId} at timestamp: ${timestamp} with average filling speed ${averageFillingSpeed}`
    );
  }
}
