import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './infrastructure/prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]) };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('reports ok when the database is reachable', async () => {
      await expect(appController.health()).resolves.toEqual({
        status: 'ok',
        database: 'ok',
      });
    });

    it('throws when the database is unreachable', async () => {
      prisma.$queryRaw.mockRejectedValueOnce(new Error('connection refused'));
      await expect(appController.health()).rejects.toThrow();
    });
  });
});
