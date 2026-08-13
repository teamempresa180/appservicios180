import { existsSync, createReadStream } from 'node:fs';
import { join } from 'node:path';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { VerificationRoutes } from '../routes/verification.routes';
import { VerificationSwagger } from '../swagger/verification.swagger';
import { CreateVerificationUseCase } from '../../application/use_cases/create-verification.use-case';
import { UpdateVerificationUseCase } from '../../application/use_cases/update-verification.use-case';
import { GetVerificationUseCase } from '../../application/use_cases/get-verification.use-case';
import { ListVerificationUseCase } from '../../application/use_cases/list-verification.use-case';
import { SearchVerificationUseCase } from '../../application/use_cases/search-verification.use-case';
import { UploadVerificationDocumentUseCase } from '../../application/use_cases/upload-verification-document.use-case';
import { GetVerificationQuery } from '../../application/queries/get-verification.query';
import { ListVerificationQuery } from '../../application/queries/list-verification.query';
import { SearchVerificationQuery } from '../../application/queries/search-verification.query';
import { CreateVerificationRequestDto } from '../dto/create-verification.request.dto';
import { UpdateVerificationRequestDto } from '../dto/update-verification.request.dto';
import { VerificationResponseDto } from '../dto/verification.response.dto';
import { VerificationListResponseDto } from '../dto/verification-list.response.dto';
import { VerificationHttpMapper } from '../dto/verification-http.mapper';
import {
  LocalVerificationDocumentStorageService,
  UploadedVerificationDocumentFile,
} from '../../infrastructure/storage/local-verification-document-storage.service';

/**
 * REST controller for Verification. Only exposes routes, maps HTTP
 * DTOs to Application commands/queries via `VerificationHttpMapper`,
 * and delegates to the corresponding Use Case — no business logic
 * lives here. Domain exceptions thrown by Use Cases
 * (`NotFoundException`, `ValidationException`) are translated to HTTP
 * responses by the global `DomainExceptionFilter`
 * (`common/filters/`), registered in `main.ts` — this controller
 * never catches them itself.
 *
 * No Delete endpoint: there is no `DeleteVerificationUseCase` in the
 * Application layer — per Prompt 70's rule, endpoints are only
 * exposed for Use Cases that actually exist.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /verifications/search` resolves to `search()` rather than
 * being matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Verification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(VerificationRoutes.base)
export class VerificationController {
  constructor(
    private readonly createVerificationUseCase: CreateVerificationUseCase,
    private readonly updateVerificationUseCase: UpdateVerificationUseCase,
    private readonly getVerificationUseCase: GetVerificationUseCase,
    private readonly listVerificationUseCase: ListVerificationUseCase,
    private readonly searchVerificationUseCase: SearchVerificationUseCase,
    private readonly uploadVerificationDocumentUseCase: UploadVerificationDocumentUseCase,
    private readonly verificationDocumentStorage: LocalVerificationDocumentStorageService,
  ) {}

  @Post()
  @ApiOperation(VerificationSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Verification created.',
    type: VerificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Identity not found.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateVerificationRequestDto,
  ): Promise<VerificationResponseDto> {
    const verification = await this.createVerificationUseCase.execute(
      VerificationHttpMapper.toCreateCommand(dto),
    );
    return VerificationHttpMapper.toResponse(verification);
  }

  @Put(VerificationRoutes.byId)
  @ApiOperation(VerificationSwagger.update)
  @ApiParam({ name: 'id', description: 'Verification id' })
  @ApiResponse({
    status: 200,
    description: 'Verification updated.',
    type: VerificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Verification not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVerificationRequestDto,
  ): Promise<VerificationResponseDto> {
    const verification = await this.updateVerificationUseCase.execute(
      VerificationHttpMapper.toUpdateCommand(id, dto),
    );
    return VerificationHttpMapper.toResponse(verification);
  }

  @Get()
  @ApiOperation(VerificationSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Verifications.',
    type: VerificationListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<VerificationListResponseDto> {
    const query = new ListVerificationQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listVerificationUseCase.execute(query);
    return VerificationHttpMapper.toListResponse(result);
  }

  @Get(VerificationRoutes.search)
  @ApiOperation(VerificationSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'DOCUMENT' })
  @ApiResponse({
    status: 200,
    description: 'Verifications matching the search term.',
    type: [VerificationResponseDto],
  })
  async search(
    @Query('term') term: string,
  ): Promise<VerificationResponseDto[]> {
    const verifications = await this.searchVerificationUseCase.execute(
      new SearchVerificationQuery(term),
    );
    return verifications.map((verification) =>
      VerificationHttpMapper.toResponse(verification),
    );
  }

  @Get(VerificationRoutes.byId)
  @ApiOperation(VerificationSwagger.get)
  @ApiParam({ name: 'id', description: 'Verification id' })
  @ApiResponse({
    status: 200,
    description: 'Verification found.',
    type: VerificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Verification not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<VerificationResponseDto> {
    const verification = await this.getVerificationUseCase.execute(
      new GetVerificationQuery(id),
    );
    return VerificationHttpMapper.toResponse(verification);
  }

  /**
   * Two-step because they're two different concerns: `verificationDocumentStorage`
   * writes the raw bytes to disk and validates the mimetype (an
   * infrastructure/multipart concern), then
   * `uploadVerificationDocumentUseCase` persists the resulting path
   * onto the Verification (an Application concern) — same split as
   * every other controller method, which never builds a domain entity
   * by hand either.
   */
  @Post(VerificationRoutes.document)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation(VerificationSwagger.uploadDocument)
  @ApiParam({ name: 'id', description: 'Verification id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Document uploaded and Verification updated.',
    type: VerificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing file or unsupported mimetype.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Verification not found.',
    type: ErrorResponseDto,
  })
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: UploadedVerificationDocumentFile | undefined,
  ): Promise<VerificationResponseDto> {
    if (!file) {
      throw new ValidationException('file is required');
    }

    // Confirms the Verification exists *before* writing anything to disk
    // — otherwise an upload against an unknown id would leave an orphan
    // file under `uploads/verifications/<id>/`. `GetVerificationUseCase`
    // throws `NotFoundException` (translated to a 404 by
    // `DomainExceptionFilter`) exactly like every other `:id` route here.
    await this.getVerificationUseCase.execute(new GetVerificationQuery(id));

    const documentPath = await this.verificationDocumentStorage.save(id, file);
    const verification = await this.uploadVerificationDocumentUseCase.execute(
      VerificationHttpMapper.toUploadDocumentCommand(id, documentPath),
    );
    return VerificationHttpMapper.toResponse(verification);
  }

  /**
   * Streams the uploaded document instead of serving `uploads/` as a
   * public static mount (the previous behavior, closed in `main.ts`)
   * — a KYC document (national ID, selfie, certificate) is exactly
   * the kind of file that must never be reachable by an unguessed-URL
   * guess alone. Only the Identity the Verification belongs to, or an
   * Admin, may fetch it.
   */
  @Get(VerificationRoutes.document)
  @ApiOperation(VerificationSwagger.getDocument)
  @ApiParam({ name: 'id', description: 'Verification id' })
  @ApiResponse({ status: 200, description: 'Document file stream.' })
  @ApiResponse({
    status: 403,
    description: 'Not the owner of this Verification.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Verification or document not found.',
    type: ErrorResponseDto,
  })
  async getDocument(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ): Promise<void> {
    const verification = await this.getVerificationUseCase.execute(
      new GetVerificationQuery(id),
    );
    if (verification.identityId !== user.id && user.role !== Role.Admin) {
      throw new ForbiddenException(
        'Not authorized to access this document',
      );
    }
    if (!verification.documentPath) {
      throw new NotFoundException(`Verification ${id} has no document`);
    }

    const absolutePath = join(process.cwd(), verification.documentPath);
    if (!existsSync(absolutePath)) {
      throw new NotFoundException(`Document for Verification ${id} not found`);
    }

    createReadStream(absolutePath).pipe(res);
  }
}
