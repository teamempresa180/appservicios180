import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateProfileCommand } from '../../application/commands/create-profile.command';
import { UpdateProfileCommand } from '../../application/commands/update-profile.command';
import { UpdateProfileAvatarCommand } from '../../application/commands/update-profile-avatar.command';
import { ProfileDto } from '../../application/dto/profile.dto';
import { CreateProfileRequestDto } from './create-profile.request.dto';
import { UpdateProfileRequestDto } from './update-profile.request.dto';
import { ProfileResponseDto } from './profile.response.dto';
import { ProfileListResponseDto } from './profile-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `ProfileController` never builds a
 * `CreateProfileCommand` or a `ProfileResponseDto` by hand.
 */
export class ProfileHttpMapper {
  static toCreateCommand(
    dto: CreateProfileRequestDto,
    caller: AuthenticatedUser,
  ): CreateProfileCommand {
    return new CreateProfileCommand(
      dto.identityId,
      caller.id,
      caller.role,
      dto.displayName,
      dto.avatarUrl ?? null,
      dto.bio ?? null,
      dto.visibility,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateProfileRequestDto,
    caller: AuthenticatedUser,
  ): UpdateProfileCommand {
    return new UpdateProfileCommand(
      id,
      caller.id,
      caller.role,
      dto.displayName,
      dto.visibility,
      dto.status,
    );
  }

  static toUpdateAvatarCommand(
    id: string,
    avatarUrl: string,
    caller: AuthenticatedUser,
  ): UpdateProfileAvatarCommand {
    return new UpdateProfileAvatarCommand(
      id,
      caller.id,
      caller.role,
      avatarUrl,
    );
  }

  static toResponse(dto: ProfileDto): ProfileResponseDto {
    const response = new ProfileResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.displayName = dto.displayName;
    response.avatarUrl = dto.avatarUrl;
    response.bio = dto.bio;
    response.visibility = dto.visibility;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<ProfileDto>,
  ): ProfileListResponseDto {
    const response = new ProfileListResponseDto();
    response.items = result.items.map((item) =>
      ProfileHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
