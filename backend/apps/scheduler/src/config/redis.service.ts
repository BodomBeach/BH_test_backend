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

  async getDevices(): Promise<{ deviceId: string; deviceType: string }[]> {
    const keys = await this.client.keys("*");

    const deviceData = keys.map((key) => {
      const [deviceType, deviceId] = key.split(":");
      return { deviceId, deviceType };
    });

    const uniqueDevices = deviceData.filter(
      (device, index, self) =>
        index === self.findIndex((d) => d.deviceId === device.deviceId)
    );

    return uniqueDevices;
  }
}
