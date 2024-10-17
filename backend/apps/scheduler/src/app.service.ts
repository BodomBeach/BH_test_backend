import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { RedisService } from "./config/redis.service";
import { RabbitMQService } from "./config/rabbitmq/rabbitmq.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly redisService: RedisService,
    private readonly rabbitMQService: RabbitMQService
  ) {}

  async onModuleInit() {
    await this.rabbitMQService.connectToRabbitMQ();
  }

  async onModuleDestroy() {
    await this.rabbitMQService.disconnectFromRabbitMQ();
  }

  @Cron("*/5 * * * * *") // Every 5 seconds
  async handleConsolidation() {
    console.log("Scheduler running...");

    // Get all unique device IDs and types from Redis
    const devices = await this.redisService.getDevices();

    if (!devices || devices.length === 0) {
      console.log("No devices found in Redis");
      return;
    }

    const roundedTimestamp = this.getRoundedTimestamp();

    for (const device of devices) {
      const { deviceId, deviceType } = device;
      const routingKey = this.getRoutingKey(deviceType);
      this.rabbitMQService.publishMessage(
        "bh.devices.data.consolidate",
        "ep",
        JSON.stringify({ deviceId: deviceId, timestamp: roundedTimestamp })
      );
    }
  }

  // Helper function to get the current time rounded to the nearest 5 seconds in epoch format
  private getRoundedTimestamp(): number {
    const now = Date.now();
    const millisecondsIn5Seconds = 5 * 1000;
    return Math.floor(now / millisecondsIn5Seconds) * millisecondsIn5Seconds;
  }

  private getRoutingKey(deviceType: string): string {
    if (deviceType === "ep1" || deviceType === "ep2") {
      return "ep";
    } else {
      return "env";
    }
  }
}
