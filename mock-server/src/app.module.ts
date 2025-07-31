import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppWebSocketGateway } from './app.ws-gateway';

@Module({
  imports: [],
  providers: [AppService, AppWebSocketGateway],
})
export class AppModule {}
