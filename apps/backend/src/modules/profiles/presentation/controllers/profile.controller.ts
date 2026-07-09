import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileRoutes } from '../routes/profile.routes';
import { ProfileSwagger } from '../swagger/profile.swagger';
import { CreateProfileUseCase } from '../../application/use_cases/create-profile.use-case';
import { UpdateProfileUseCase } from '../../application/use_cases/update-profile.use-case';
import { DeleteProfileUseCase } from '../../application/use_cases/delete-profile.use-case';
import { GetProfileUseCase } from '../../application/use_cases/get-profile.use-case';
import { CreateProfileDto } from '../../application/dto/create-profile.dto';
import { UpdateProfileDto } from '../../application/dto/update-profile.dto';
import { CreateProfileCommand } from '../../application/commands/create-profile.command';
import { UpdateProfileCommand } from '../../application/commands/update-profile.command';
import { DeleteProfileCommand } from '../../application/commands/delete-profile.command';
import { GetProfileQuery } from '../../application/queries/get-profile.query';

/**
 * REST controller for Profile. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Profiles')
@Controller(ProfileRoutes.base)
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly deleteProfileUseCase: DeleteProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Post()
  @ApiOperation(ProfileSwagger.create)
  @ApiResponse({ status: 201, description: 'Profile created.' })
  create(@Body() dto: CreateProfileDto) {
    return this.createProfileUseCase.execute(
      new CreateProfileCommand(
        dto.identityId,
        dto.displayName,
        dto.avatarUrl,
        dto.bio,
        dto.visibility,
      ),
    );
  }

  @Put(ProfileRoutes.byId)
  @ApiOperation(ProfileSwagger.update)
  @ApiResponse({ status: 200, description: 'Profile updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(
      new UpdateProfileCommand(id, dto.displayName, dto.visibility, dto.status),
    );
  }

  @Delete(ProfileRoutes.byId)
  @ApiOperation(ProfileSwagger.delete)
  @ApiResponse({ status: 200, description: 'Profile deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteProfileUseCase.execute(new DeleteProfileCommand(id));
  }

  @Get(ProfileRoutes.byId)
  @ApiOperation(ProfileSwagger.get)
  @ApiResponse({ status: 200, description: 'Profile found.' })
  findOne(@Param('id') id: string) {
    return this.getProfileUseCase.execute(new GetProfileQuery(id));
  }
}
