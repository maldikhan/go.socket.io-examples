import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AppWebSocketGateway } from './app.ws-gateway';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide AppService', () => {
    const appService = module.get<AppService>(AppService);
    expect(appService).toBeDefined();
    expect(appService).toBeInstanceOf(AppService);
  });

  it('should provide AppWebSocketGateway', () => {
    const gateway = module.get<AppWebSocketGateway>(AppWebSocketGateway);
    expect(gateway).toBeDefined();
    expect(gateway).toBeInstanceOf(AppWebSocketGateway);
  });
});
