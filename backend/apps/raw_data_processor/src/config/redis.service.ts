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

  async setWithExpiry(key: string, value: any, ttl: number) {
    await this.client.set(key, JSON.stringify(value), "EX", ttl);
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }
}
