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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { ProfileRoutes } from '../routes/profile.routes';
import { ProfileSwagger } from '../swagger/profile.swagger';
import { CreateProfileUseCase } from '../../application/use_cases/create-profile.use-case';
import { UpdateProfileUseCase } from '../../application/use_cases/update-profile.use-case';
import { DeleteProfileUseCase } from '../../application/use_cases/delete-profile.use-case';
import { GetProfileUseCase } from '../../application/use_cases/get-profile.use-case';
import { ListProfileUseCase } from '../../application/use_cases/list-profile.use-case';
import { SearchProfileUseCase } from '../../application/use_cases/search-profile.use-case';
import { DeleteProfileCommand } from '../../application/commands/delete-profile.command';
import { GetProfileQuery } from '../../application/queries/get-profile.query';
import { ListProfileQuery } from '../../application/queries/list-profile.query';
import { SearchProfileQuery } from '../../application/queries/search-profile.query';
import { CreateProfileRequestDto } from '../dto/create-profile.request.dto';
import { UpdateProfileRequestDto } from '../dto/update-profile.request.dto';
import { ProfileResponseDto } from '../dto/profile.response.dto';
import { ProfileListResponseDto } from '../dto/profile-list.response.dto';
import { ProfileHttpMapper } from '../dto/profile-http.mapper';

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
 */
@ApiTags('Profiles')
@UseGuards(JwtAuthGuard)
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
  async create(
    @Body() dto: CreateProfileRequestDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.createProfileUseCase.execute(
      ProfileHttpMapper.toCreateCommand(dto),
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
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileRequestDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.updateProfileUseCase.execute(
      ProfileHttpMapper.toUpdateCommand(id, dto),
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
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProfileUseCase.execute(new DeleteProfileCommand(id));
  }

  @Get()
  @ApiOperation(ProfileSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Profiles.',
    type: ProfileListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ProfileListResponseDto> {
    const query = new ListProfileQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listProfileUseCase.execute(query);
    return ProfileHttpMapper.toListResponse(result);
  }

  @Get(ProfileRoutes.search)
  @ApiOperation(ProfileSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'Jane' })
  @ApiResponse({
    status: 200,
    description: 'Profiles matching the search term.',
    type: [ProfileResponseDto],
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
  async findOne(@Param('id') id: string): Promise<ProfileResponseDto> {
    const profile = await this.getProfileUseCase.execute(
      new GetProfileQuery(id),
    );
    return ProfileHttpMapper.toResponse(profile);
  }
}
