import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';

/**
 * HTTP request body for `PUT /verifications/:id`. Distinct from
 * `application/dto/update-verification.dto.ts` — see
 * `create-verification.request.dto.ts` for the rationale. Only
 * mirrors the field `UpdateVerificationCommand` actually accepts
 * (`status`) — `verifiedAt` is not settable via HTTP, per the
 * existing Application layer contract.
 */
export class UpdateVerificationRequestDto {
  @ApiPropertyOptional({
    enum: VerificationStatus,
    example: VerificationStatus.Pending,
    description:
      'Only an Admin may set an arbitrary status; the owner may only resubmit a rejected Verification as PENDING.',
  })
  @IsOptional()
  @IsEnum(VerificationStatus)
  status?: VerificationStatus;
}
