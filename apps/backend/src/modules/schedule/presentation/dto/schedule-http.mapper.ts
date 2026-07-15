import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateScheduleCommand } from '../../application/commands/create-schedule.command';
import { UpdateScheduleCommand } from '../../application/commands/update-schedule.command';
import { ScheduleDto } from '../../application/dto/schedule.dto';
import { CreateScheduleRequestDto } from './create-schedule.request.dto';
import { UpdateScheduleRequestDto } from './update-schedule.request.dto';
import { ScheduleResponseDto } from './schedule.response.dto';
import { ScheduleListResponseDto } from './schedule-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `ScheduleController` never builds a
 * `CreateScheduleCommand` or a `ScheduleResponseDto` by hand.
 * `startDateTime`/`endDateTime` are parsed here (ISO string →
 * `Date`); malformed input still reaches `ScheduleValidator`, which
 * already rejects a non-`Date`/invalid `Date` — no validation logic
 * is duplicated here.
 */
export class ScheduleHttpMapper {
  static toCreateCommand(dto: CreateScheduleRequestDto): CreateScheduleCommand {
    return new CreateScheduleCommand(
      dto.providerId,
      new Date(dto.startDateTime),
      new Date(dto.endDateTime),
      dto.type,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateScheduleRequestDto,
  ): UpdateScheduleCommand {
    return new UpdateScheduleCommand(
      id,
      dto.startDateTime !== undefined ? new Date(dto.startDateTime) : undefined,
      dto.endDateTime !== undefined ? new Date(dto.endDateTime) : undefined,
      dto.status,
    );
  }

  static toResponse(dto: ScheduleDto): ScheduleResponseDto {
    const response = new ScheduleResponseDto();
    response.id = dto.id;
    response.providerId = dto.providerId;
    response.startDateTime = dto.startDateTime.toISOString();
    response.endDateTime = dto.endDateTime.toISOString();
    response.status = dto.status;
    response.type = dto.type;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<ScheduleDto>,
  ): ScheduleListResponseDto {
    const response = new ScheduleListResponseDto();
    response.items = result.items.map((item) =>
      ScheduleHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
