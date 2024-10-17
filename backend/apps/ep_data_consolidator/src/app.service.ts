import { Injectable } from "@nestjs/common";
import { RedisService } from "./config/redis.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EPConsolidatedData } from "./entities/ep-consolidated-data.entity";

@Injectable()
export class AppService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(EPConsolidatedData)
    private readonly consolidatedDataRepository: Repository<EPConsolidatedData>
  ) {}

  async processMessage(data: any) {
    const timestamp = data.timestamp;
    const deviceId = data.deviceId;
    console.log(data);

    console.log(
      `Processing message for deviceId: ${deviceId} at timestamp: ${timestamp}`
    );

    // Define the time range: 5 seconds before the timestamp
    const startTime = timestamp - 5000;
    const endTime = timestamp;

    // Get energy data from Redis for the time range
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

    // TODO
    // send dataInRange to an interpolation service, adding artificial data to fill the gaps if data is missing.

    // Calculate the average energy
    const totalEnergy = dataInRange.reduce((acc, data) => acc + data.energy, 0);
    const averageEnergy = totalEnergy / dataInRange.length;

    // Create and save the consolidated data to MySQL
    const consolidatedData = new EPConsolidatedData();
    consolidatedData.deviceId = deviceId;
    consolidatedData.timestamp = timestamp;
    consolidatedData.averageEnergy = averageEnergy;

    await this.consolidatedDataRepository.save(consolidatedData);
    console.log(
      `Consolidated data saved for deviceId: ${deviceId} at timestamp: ${timestamp} with average energy ${averageEnergy}`
    );
  }
}
