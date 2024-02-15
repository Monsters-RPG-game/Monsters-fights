import { Controller, Get } from '@nestjs/common';
import AppService from './app.service';

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {
    console.info('Added log for eslint to not be mad');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
