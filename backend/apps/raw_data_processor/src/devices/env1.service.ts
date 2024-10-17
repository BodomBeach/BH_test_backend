import { Injectable } from "@nestjs/common";
import { RedisService } from "../config/redis.service";
import { RawEnv1Data } from "../models/raw-env1-data.model";

@Injectable()
export class Env1Service {
  constructor(private readonly redisService: RedisService) {}

  async processEnv1Data(data: any) {
    const datum: RawEnv1Data = {
      id: data.id,
      filling_level: data.d.filling_level,
      timestamp: Date.parse(data.ts),
      tag: data.tag,
      device_type: "env1",
    };

    if (datum.filling_level === 0) {
      // TODO
      // publish message with high priority to exchange "bh.devices.data.consolidate" with routing key "env"
      // this message will be consumed by service env_data_consolidator
    }

    const redisKey = `${datum.device_type}:${datum.id}:${datum.timestamp}`;
    await this.redisService.setWithExpiry(redisKey, datum, 300); // TTL = 5 minutes
    console.log(`Env1 data saved with Redis key: ${redisKey}`);
  }
}
