import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway({
  connectionStateRecovery: {},
  cors: '*',
})
export class AppWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: AppService) {
    console.log('ws gateway run');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Client connected');
    client.emit('demo-connected', { message: 'you are connected!' });
  }

  async handleDisconnect() {
    console.log('Client disconnected');
  }

  @SubscribeMessage('hi')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    const userName = client.handshake.auth.userName;
    return 'Hi,' + userName;
  }

  @SubscribeMessage('delay')
  async handleDelayEvent(@MessageBody() duration: number): Promise<string> {
    if (duration > 1000) return 'max delay duration is 1000';
    await new Promise((ok) => setTimeout(ok, duration));
    return 'Delay ' + duration + ' done';
  }

  @SubscribeMessage('load')
  handleLoad(@MessageBody() num: number, @ConnectedSocket() client: Socket) {
    for (let i = 0; i < num; i++) {
      client.emit('boom', i, 'boom', num - i);
    }
  }

  @SubscribeMessage('get_square')
  handleGetSquare(
    @MessageBody() num: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (num > 1000 || num < -1000) {
      return 'num must be in range [-1000;1000]';
    }
    client.emit('result', num + '^2', num * num);
    return '';
  }

  @SubscribeMessage('get_sum')
  handleGetSum(
    @MessageBody() nums: number[],
    @ConnectedSocket() client: Socket,
  ) {
    console.log('get sum of', nums);
    if (nums.length > 10) {
      return 'max 10 nums supported';
    }
    if (nums.some((num) => num < -1000 || num > 1000)) {
      return 'nums must be in range [-1000;1000]';
    }
    const result = nums.reduce((val, num) => val + num, 0);
    client.emit('result', nums.join('+'), result);
    return '';
  }
}
