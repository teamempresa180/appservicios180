import { Controller, Get, HttpCode, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Liveness/readiness probe for Railway (or any orchestrator). Public
   * by design — a health check that itself requires a token can't be
   * used by infra that doesn't have one. Confirms the database is
   * actually reachable, not just that the Node process is up: a
   * `SELECT 1` costs one round trip and catches the specific failure
   * mode ("process running, DB unreachable") a bare 200 would hide.
   */
  @Get('health')
  @HttpCode(200)
  async health(): Promise<{ status: 'ok'; database: 'ok' }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'unreachable',
      });
    }
    return { status: 'ok', database: 'ok' };
  }
}
