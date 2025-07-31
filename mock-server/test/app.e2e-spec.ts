import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { io, Socket } from 'socket.io-client';

describe('WebSocket Gateway (e2e)', () => {
  let app: INestApplication;
  let client: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0); // Use random port for testing

    const port = app.getHttpServer().address().port;
    client = io(`http://localhost:${port}`, {
      auth: {
        userName: 'testUser',
      },
    });

    await new Promise<void>((resolve) => {
      client.on('connect', resolve);
    });
  });

  afterAll(async () => {
    client.disconnect();
    await app.close();
  });

  afterEach(() => {
    client.removeAllListeners();
  });

  it('should emit demo-connected event on connection', (done) => {
    // Reconnect to test connection event
    client.disconnect();
    
    client.once('demo-connected', (data) => {
      expect(data).toEqual({ message: 'you are connected!' });
      done();
    });

    client.connect();
  });

  it('should respond to hi event', (done) => {
    client.emit('hi', 'Hello', (response: string) => {
      expect(response).toBe('Hi,testUser');
      done();
    });
  });

  it('should handle delay event', (done) => {
    const duration = 100;
    const startTime = Date.now();
    
    client.emit('delay', duration, (response: string) => {
      const endTime = Date.now();
      expect(response).toBe(`Delay ${duration} done`);
      expect(endTime - startTime).toBeGreaterThanOrEqual(duration);
      done();
    });
  });

  it('should reject delay duration greater than 1000', (done) => {
    client.emit('delay', 1001, (response: string) => {
      expect(response).toBe('max delay duration is 1000');
      done();
    });
  });

  it('should emit boom events on load', (done) => {
    const num = 3;
    let receivedCount = 0;
    const received: any[] = [];

    client.on('boom', (index: number, text: string, remaining: number) => {
      received.push({ index, text, remaining });
      receivedCount++;
      
      if (receivedCount === num) {
        expect(received).toEqual([
          { index: 0, text: 'boom', remaining: 3 },
          { index: 1, text: 'boom', remaining: 2 },
          { index: 2, text: 'boom', remaining: 1 },
        ]);
        done();
      }
    });

    client.emit('load', num);
  });

  it('should calculate square for valid number', (done) => {
    const num = 5;

    client.once('result', (expression: string, result: number) => {
      expect(expression).toBe(`${num}^2`);
      expect(result).toBe(25);
      done();
    });

    client.emit('get_square', num, (response: string) => {
      expect(response).toBe('');
    });
  });

  it('should reject square calculation for number out of range', (done) => {
    client.emit('get_square', 1001, (response: string) => {
      expect(response).toBe('num must be in range [-1000;1000]');
      done();
    });
  });

  it('should calculate sum for valid numbers', (done) => {
    const nums = [1, 2, 3, 4, 5];

    client.once('result', (expression: string, result: number) => {
      expect(expression).toBe('1+2+3+4+5');
      expect(result).toBe(15);
      done();
    });

    client.emit('get_sum', nums, (response: string) => {
      expect(response).toBe('');
    });
  });

  it('should reject sum calculation for too many numbers', (done) => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    
    client.emit('get_sum', nums, (response: string) => {
      expect(response).toBe('max 10 nums supported');
      done();
    });
  });

  it('should reject sum calculation for numbers out of range', (done) => {
    const nums = [100, 1001, 200];
    
    client.emit('get_sum', nums, (response: string) => {
      expect(response).toBe('nums must be in range [-1000;1000]');
      done();
    });
  });
});