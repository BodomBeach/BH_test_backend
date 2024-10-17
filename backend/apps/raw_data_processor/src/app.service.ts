import { Injectable } from "@nestjs/common";
import { EP1Service } from "./devices/ep1.service";
import { EP2Service } from "./devices/ep2.service";
import { Env1Service } from "./devices/env1.service";

@Injectable()
export class AppService {
  constructor(
    private readonly ep1Service: EP1Service,
    private readonly ep2Service: EP2Service,
    private readonly env1Service: Env1Service
  ) {}

  // Process message and route to the correct device service
  async processMessage(data: any) {
    const deviceType = this.getDeviceType(data);

    switch (deviceType) {
      case "EP1":
        await this.ep1Service.processEP1Data(data);
        break;

      case "EP2":
        await this.ep2Service.processEP2Data(data);
        break;

      case "Env1":
        await this.env1Service.processEnv1Data(data);
        break;

      default:
        throw new Error("Unknown device type");
    }
  }

  private getDeviceType(data: any): string {
    if (data.device) {
      return "EP1";
    } else if (data.from && data.content?.energy) {
      return "EP2";
    } else if (data.id && data.d?.filling_level !== undefined) {
      return "Env1";
    } else {
      return "Unknown";
    }
  }
}
