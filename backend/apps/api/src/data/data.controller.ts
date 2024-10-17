import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt.guard';

@Controller('data')
export class DataController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getRawData() {
    // TODO
    // query redis database to return records within time query parameters...
  }

  @Get()
  getConsolidatedData() {
    // TODO
    // query mysql database to return records within time query parameters...
  }

  @Post()
  forceEmpty() {
    // TODO
    // publish to RMQ exchange "bh.devices.data.consolidate.env" a high priority message with filling_level = 0
  }
}
