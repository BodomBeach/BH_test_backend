import { Injectable } from "@nestjs/common";
import { RedisService } from "../config/redis.service";
import { RawEP2Data } from "../models/raw-ep2-data.model";

@Injectable()
export class EP2Service {
  constructor(private readonly redisService: RedisService) {}

  async processEP2Data(data: any) {
    const datum: RawEP2Data = {
      id: data.from,
      energy: data.content.energy,
      timestamp: Date.parse(data.timestamp),
      tag: data.tag,
      device_type: "ep2",
    };

    const redisKey = `${datum.device_type}:${datum.id}:${datum.timestamp}`;
    await this.redisService.setWithExpiry(redisKey, datum, 300); // TTL = 5 minutes
    console.log(`EP2 data saved with Redis key: ${redisKey}`);
  }
}
