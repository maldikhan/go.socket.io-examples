import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('bootstrap', () => {
  let app: any;

  beforeEach(() => {
    app = {
      listen: jest.fn(),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create app and listen on port 3300', async () => {
    // Import the module to trigger bootstrap execution
    await import('./main');

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(app.listen).toHaveBeenCalledWith(3300);
  });
});
