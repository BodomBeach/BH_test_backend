import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: "redis",
      port: 6379,
    });
  }

  // Get data for the deviceId within the specified time range
  async getDataInRange(
    deviceId: string,
    startTime: number,
    endTime: number
  ): Promise<{ energy: number; timestamp: number }[]> {
    const pattern = `ep*:${deviceId}:*`;
    const results = [];

    // Get keys matching the pattern
    const keys = await this.client.keys(pattern);

    // Fetch data for each key and filter by timestamp
    for (const key of keys) {
      const data = await this.client.get(key);
      if (data) {
        const parsedData = JSON.parse(data);
        if (
          parsedData.timestamp >= startTime &&
          parsedData.timestamp <= endTime
        ) {
          results.push(parsedData);
        }
      }
    }
    return results;
  }
}
