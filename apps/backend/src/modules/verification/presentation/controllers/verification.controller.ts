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
 *
 * A Verification is KYC data, so every route forwards `@CurrentUser()`
 * and the Application layer decides per row: reads and document
 * uploads are restricted to the owning Identity (or an Admin), and
 * approving a Verification is an Admin-only transition — the owner may
 * only resubmit a rejected one. No `@Roles(...)` gate on the class:
 * ordinary users must still be able to open and resubmit their own
 * verification.
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
  @ApiResponse({
    status: 403,
    description: 'Caller is not the Identity the Verification is for.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateVerificationRequestDto,
    @CurrentUser() caller: AuthenticatedUser,
  ): Promise<VerificationResponseDto> {
    const verification = await this.createVerificationUseCase.execute(
      VerificationHttpMapper.toCreateCommand(dto, caller),
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
  @ApiResponse({
    status: 403,
    description:
      'Caller does not own this Verification, or attempted a status transition reserved for an Admin.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVerificationRequestDto,
    @CurrentUser() caller: AuthenticatedUser,
  ): Promise<VerificationResponseDto> {
    const verification = await this.updateVerificationUseCase.execute(
      VerificationHttpMapper.toUpdateCommand(id, dto, caller),
    );
    return VerificationHttpMapper.toResponse(verification);
  }

  @Get()
  @ApiOperation(VerificationSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of the caller’s own Verifications.',
    type: VerificationListResponseDto,
  })
  async list(
    @CurrentUser() caller: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<VerificationListResponseDto> {
    const query = new ListVerificationQuery(
      caller,
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
    @CurrentUser() caller: AuthenticatedUser,
  ): Promise<VerificationResponseDto[]> {
    const verifications = await this.searchVerificationUseCase.execute(
      new SearchVerificationQuery(term, caller),
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
  @ApiResponse({
    status: 403,
    description: 'Caller does not own this Verification.',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() caller: AuthenticatedUser,
  ): Promise<VerificationResponseDto> {
    const verification = await this.getVerificationUseCase.execute(
      new GetVerificationQuery(id, caller),
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
  // 10 MB: comfortably above a photographed ID or a scanned
  // certificate, and low enough that an unbounded upload can no longer
  // be used to exhaust disk or memory. Multer rejects anything larger
  // before the handler runs.
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
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
  @ApiResponse({
    status: 403,
    description: 'Caller does not own this Verification.',
    type: ErrorResponseDto,
  })
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: UploadedVerificationDocumentFile | undefined,
    @CurrentUser() caller: AuthenticatedUser,
  ): Promise<VerificationResponseDto> {
    if (!file) {
      throw new ValidationException('file is required');
    }

    // Confirms the Verification exists *and belongs to the caller*
    // before writing anything to disk — otherwise an upload against an
    // unknown or foreign id would leave a file under
    // `uploads/verifications/<id>/` regardless. `GetVerificationUseCase`
    // throws `NotFoundException`/`ForbiddenException` (translated to
    // 404/403 by `DomainExceptionFilter`) exactly like every other
    // `:id` route here; the use case below re-checks ownership so the
    // rule holds for any future caller too.
    await this.getVerificationUseCase.execute(
      new GetVerificationQuery(id, caller),
    );

    const documentPath = await this.verificationDocumentStorage.save(id, file);
    const verification = await this.uploadVerificationDocumentUseCase.execute(
      VerificationHttpMapper.toUploadDocumentCommand(id, documentPath, caller),
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
      new GetVerificationQuery(id, user),
    );
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
