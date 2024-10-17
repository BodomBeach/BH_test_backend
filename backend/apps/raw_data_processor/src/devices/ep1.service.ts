import { Injectable } from "@nestjs/common";
import { RedisService } from "../config/redis.service";
import { RawEP1Data } from "../models/raw-ep1-data.model";

@Injectable()
export class EP1Service {
  constructor(private readonly redisService: RedisService) {}

  async processEP1Data(data: any) {
    const datum: RawEP1Data = {
      id: data.device,
      energy: data.energy * Math.pow(10, data.unit), // Convert energy to Wh
      timestamp: Date.parse(data.ts),
      tag: data.tag,
      device_type: "ep1",
    };

    const redisKey = `${datum.device_type}:${datum.id}:${datum.timestamp}`;
    await this.redisService.setWithExpiry(redisKey, datum, 300); // TTL = 5 minutes
    console.log(`EP1 data saved with Redis key: ${redisKey}`);
  }
}
