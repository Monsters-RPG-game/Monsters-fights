import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import AppService from './app.service';

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {
    console.info('Added log for eslint to not be mad');
  }

  @MessagePattern()
  async handleMessage(data: unknown): Promise<void> {
    return this.appService.handleMessage(data);
  }
}
