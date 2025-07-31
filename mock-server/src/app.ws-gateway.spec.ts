import { Test, TestingModule } from '@nestjs/testing';
import { AppWebSocketGateway } from './app.ws-gateway';
import { AppService } from './app.service';
import { Socket } from 'socket.io';

describe('AppWebSocketGateway', () => {
  let gateway: AppWebSocketGateway;
  let mockClient: any;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppWebSocketGateway, AppService],
    }).compile();

    gateway = module.get<AppWebSocketGateway>(AppWebSocketGateway);

    mockClient = {
      handshake: {
        auth: {
          userName: 'testUser',
        },
      },
      emit: jest.fn(),
    } as unknown as Socket;
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should log "ws gateway run" on initialization', () => {
    expect(consoleLogSpy).toHaveBeenCalledWith('ws gateway run');
  });

  describe('handleConnection', () => {
    it('should handle client connection', async () => {
      await gateway.handleConnection(mockClient);

      expect(consoleLogSpy).toHaveBeenCalledWith('Client connected');
      expect(mockClient.emit).toHaveBeenCalledWith('demo-connected', {
        message: 'you are connected!',
      });
    });
  });

  describe('handleDisconnect', () => {
    it('should handle client disconnection', async () => {
      await gateway.handleDisconnect();

      expect(consoleLogSpy).toHaveBeenCalledWith('Client disconnected');
    });
  });

  describe('handleEvent', () => {
    it('should return greeting with username', () => {
      const result = gateway.handleEvent('test data', mockClient);

      expect(result).toBe('Hi,testUser');
    });
  });

  describe('handleDelayEvent', () => {
    it('should handle delay within valid range', async () => {
      const duration = 100;
      const result = await gateway.handleDelayEvent(duration);

      expect(result).toBe(`Delay ${duration} done`);
    });

    it('should reject delay duration greater than 1000', async () => {
      const result = await gateway.handleDelayEvent(1001);

      expect(result).toBe('max delay duration is 1000');
    });
  });

  describe('handleLoad', () => {
    it('should emit boom events', () => {
      const num = 5;
      gateway.handleLoad(num, mockClient);

      expect(mockClient.emit).toHaveBeenCalledTimes(num);
      for (let i = 0; i < num; i++) {
        expect(mockClient.emit).toHaveBeenNthCalledWith(
          i + 1,
          'boom',
          i,
          'boom',
          num - i,
        );
      }
    });

    it('should handle zero load', () => {
      gateway.handleLoad(0, mockClient);

      expect(mockClient.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleGetSquare', () => {
    it('should calculate square for valid number', () => {
      const num = 5;
      const result = gateway.handleGetSquare(num, mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith(
        'result',
        `${num}^2`,
        num * num,
      );
      expect(result).toBe('');
    });

    it('should reject number greater than 1000', () => {
      const result = gateway.handleGetSquare(1001, mockClient);

      expect(result).toBe('num must be in range [-1000;1000]');
      expect(mockClient.emit).not.toHaveBeenCalled();
    });

    it('should reject number less than -1000', () => {
      const result = gateway.handleGetSquare(-1001, mockClient);

      expect(result).toBe('num must be in range [-1000;1000]');
      expect(mockClient.emit).not.toHaveBeenCalled();
    });

    it('should handle negative numbers within range', () => {
      const num = -50;
      const result = gateway.handleGetSquare(num, mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith(
        'result',
        `${num}^2`,
        num * num,
      );
      expect(result).toBe('');
    });

    it('should handle zero', () => {
      const num = 0;
      const result = gateway.handleGetSquare(num, mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith('result', `${num}^2`, 0);
      expect(result).toBe('');
    });
  });

  describe('handleGetSum', () => {
    it('should calculate sum for valid numbers', () => {
      const nums = [1, 2, 3, 4, 5];
      const result = gateway.handleGetSum(nums, mockClient);

      expect(consoleLogSpy).toHaveBeenCalledWith('get sum of', nums);
      expect(mockClient.emit).toHaveBeenCalledWith('result', '1+2+3+4+5', 15);
      expect(result).toBe('');
    });

    it('should reject more than 10 numbers', () => {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const result = gateway.handleGetSum(nums, mockClient);

      expect(result).toBe('max 10 nums supported');
      expect(mockClient.emit).not.toHaveBeenCalled();
    });

    it('should reject numbers outside valid range', () => {
      const nums = [100, 1001, 200];
      const result = gateway.handleGetSum(nums, mockClient);

      expect(result).toBe('nums must be in range [-1000;1000]');
      expect(mockClient.emit).not.toHaveBeenCalled();
    });

    it('should reject negative numbers outside valid range', () => {
      const nums = [-100, -1001, -200];
      const result = gateway.handleGetSum(nums, mockClient);

      expect(result).toBe('nums must be in range [-1000;1000]');
      expect(mockClient.emit).not.toHaveBeenCalled();
    });

    it('should handle empty array', () => {
      const nums: number[] = [];
      const result = gateway.handleGetSum(nums, mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith('result', '', 0);
      expect(result).toBe('');
    });

    it('should handle negative numbers within range', () => {
      const nums = [-5, -10, 20];
      const result = gateway.handleGetSum(nums, mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith('result', '-5+-10+20', 5);
      expect(result).toBe('');
    });

    it('should handle exactly 10 numbers', () => {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = gateway.handleGetSum(nums, mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith(
        'result',
        '1+2+3+4+5+6+7+8+9+10',
        55,
      );
      expect(result).toBe('');
    });
  });
});
