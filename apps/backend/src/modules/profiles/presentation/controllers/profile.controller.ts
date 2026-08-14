import {
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { RolesGuard } from '../../../../common/auth/roles.guard';
import { Roles } from '../../../../common/auth/roles.decorator';
import { Role } from '../../../../common/auth/role.enum';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ProfileRoutes } from '../routes/profile.routes';
import { ProfileSwagger } from '../swagger/profile.swagger';
import { CreateProfileUseCase } from '../../application/use_cases/create-profile.use-case';
import { UpdateProfileUseCase } from '../../application/use_cases/update-profile.use-case';
import { DeleteProfileUseCase } from '../../application/use_cases/delete-profile.use-case';
import { GetProfileUseCase } from '../../application/use_cases/get-profile.use-case';
import { ListProfileUseCase } from '../../application/use_cases/list-profile.use-case';
import { SearchProfileUseCase } from '../../application/use_cases/search-profile.use-case';
import { UpdateProfileAvatarUseCase } from '../../application/use_cases/update-profile-avatar.use-case';
import { DeleteProfileCommand } from '../../application/commands/delete-profile.command';
import { GetProfileQuery } from '../../application/queries/get-profile.query';
import { ListProfileQuery } from '../../application/queries/list-profile.query';
import { SearchProfileQuery } from '../../application/queries/search-profile.query';
import { CreateProfileRequestDto } from '../dto/create-profile.request.dto';
import { UpdateProfileRequestDto } from '../dto/update-profile.request.dto';
import { ProfileResponseDto } from '../dto/profile.response.dto';
import { ProfileListResponseDto } from '../dto/profile-list.response.dto';
import { ProfileHttpMapper } from '../dto/profile-http.mapper';
import {
  LocalProfileAvatarStorageService,
  UploadedProfileAvatarFile,
} from '../../infrastructure/storage/local-profile-avatar-storage.service';

/**
 * REST controller for Profile. Only exposes routes, maps HTTP DTOs
 * to Application commands/queries via `ProfileHttpMapper`, and
 * delegates to the corresponding Use Case — no business logic lives
 * here. Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`) are translated to HTTP responses by the
 * global `DomainExceptionFilter` (`common/filters/`), registered in
 * `main.ts` — this controller never catches them itself.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /profiles/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 *
 * Access control (Etapa 18) is deliberately *not* uniform here,
 * because a Profile is the public face of an account rather than
 * private data:
 * - writes (`create`/`update`/`remove`/`uploadAvatar`) are owner-only;
 *   each passes `@CurrentUser()` to its Use Case, which answers 403 for
 *   anyone else's Profile.
 * - `findOne` honours the Profile's own `visibility` — `Public` is
 *   readable by any authenticated caller (that is how a Provider's
 *   card, chat header, order and reviews resolve their Profile),
 *   `Private` only by its owner.
 * - `list` returns only the caller's own Profiles; it used to return
 *   the entire user directory to anyone with a token.
 * - `search` is a cross-account, free-text lookup over every
 *   `displayName`/`bio` with no owner filter possible, and nothing in
 *   the app calls it — so it is gated to `@Roles(Role.Admin)`, a role
 *   nothing issues yet, which closes it until the domain defines
 *   administrative accounts.
 */
@ApiTags('Profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller(ProfileRoutes.base)
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly deleteProfileUseCase: DeleteProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly listProfileUseCase: ListProfileUseCase,
    private readonly searchProfileUseCase: SearchProfileUseCase,
    private readonly updateProfileAvatarUseCase: UpdateProfileAvatarUseCase,
    private readonly profileAvatarStorage: LocalProfileAvatarStorageService,
  ) {}

  @Post()
  @ApiOperation(ProfileSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Profile created.',
    type: ProfileResponseDto,
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
    description: 'The Identity is not the caller’s own.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateProfileRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProfileResponseDto> {
    const profile = await this.createProfileUseCase.execute(
      ProfileHttpMapper.toCreateCommand(dto, user),
    );
    return ProfileHttpMapper.toResponse(profile);
  }

  @Put(ProfileRoutes.byId)
  @ApiOperation(ProfileSwagger.update)
  @ApiParam({ name: 'id', description: 'Profile id' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated.',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'The Profile belongs to another Identity.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProfileResponseDto> {
    const profile = await this.updateProfileUseCase.execute(
      ProfileHttpMapper.toUpdateCommand(id, dto, user),
    );
    return ProfileHttpMapper.toResponse(profile);
  }

  @Delete(ProfileRoutes.byId)
  @ApiOperation(ProfileSwagger.delete)
  @ApiParam({ name: 'id', description: 'Profile id' })
  @ApiResponse({ status: 200, description: 'Profile deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Profile not found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'The Profile belongs to another Identity.',
    type: ErrorResponseDto,
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteProfileUseCase.execute(
      new DeleteProfileCommand(id, user.id, user.role),
    );
  }

  @Get()
  @ApiOperation(ProfileSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: "Paginated list of the caller's own Profiles.",
    type: ProfileListResponseDto,
  })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ProfileListResponseDto> {
    const query = new ListProfileQuery(
      user.id,
      user.role,
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listProfileUseCase.execute(query);
    return ProfileHttpMapper.toListResponse(result);
  }

  @Get(ProfileRoutes.search)
  @Roles(Role.Admin)
  @ApiOperation(ProfileSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'Jane' })
  @ApiResponse({
    status: 200,
    description: 'Profiles matching the search term.',
    type: [ProfileResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Requires an administrative account.',
    type: ErrorResponseDto,
  })
  async search(@Query('term') term: string): Promise<ProfileResponseDto[]> {
    const profiles = await this.searchProfileUseCase.execute(
      new SearchProfileQuery(term),
    );
    return profiles.map((profile) => ProfileHttpMapper.toResponse(profile));
  }

  @Get(ProfileRoutes.byId)
  @ApiOperation(ProfileSwagger.get)
  @ApiParam({ name: 'id', description: 'Profile id' })
  @ApiResponse({
    status: 200,
    description: 'Profile found.',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'The Profile is private and belongs to another Identity.',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProfileResponseDto> {
    const profile = await this.getProfileUseCase.execute(
      new GetProfileQuery(id, user.id, user.role),
    );
    return ProfileHttpMapper.toResponse(profile);
  }

  /**
   * Two-step because they're two different concerns: `profileAvatarStorage`
   * writes the raw bytes to disk and validates the mimetype (an
   * infrastructure/multipart concern), then
   * `updateProfileAvatarUseCase` persists the resulting path onto the
   * Profile (an Application concern) — same split as every other
   * controller method, which never builds a domain entity by hand
   * either.
   */
  @Post(ProfileRoutes.avatar)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation(ProfileSwagger.uploadAvatar)
  @ApiParam({ name: 'id', description: 'Profile id' })
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
    description: 'Avatar uploaded and Profile updated.',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing file or unsupported mimetype.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'The Profile belongs to another Identity.',
    type: ErrorResponseDto,
  })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: UploadedProfileAvatarFile | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProfileResponseDto> {
    if (!file) {
      throw new ValidationException('file is required');
    }

    // Confirms the Profile exists *and* belongs to the caller before
    // writing anything to disk — otherwise an upload against an unknown
    // id would leave an orphan file under `uploads/profiles/<id>/`, and
    // one against someone else's id would store an attacker-supplied
    // image there even though `UpdateProfileAvatarUseCase` would go on
    // to reject the write. `GetProfileUseCase` throws
    // `NotFoundException` (404) like every other `:id` route here; the
    // owner check is explicit because that Use Case deliberately allows
    // reading any *public* Profile, which is not enough to write to it.
    const existing = await this.getProfileUseCase.execute(
      new GetProfileQuery(id, user.id, user.role),
    );
    if (existing.identityId !== user.id && user.role !== Role.Admin) {
      throw new ForbiddenException(
        "You may only change your own Profile's avatar",
      );
    }

    const avatarUrl = await this.profileAvatarStorage.save(id, file);
    const profile = await this.updateProfileAvatarUseCase.execute(
      ProfileHttpMapper.toUpdateAvatarCommand(id, avatarUrl, user),
    );
    return ProfileHttpMapper.toResponse(profile);
  }
}
