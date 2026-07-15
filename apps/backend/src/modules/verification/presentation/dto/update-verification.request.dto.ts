import { ApiPropertyOptional } from '@nestjs/swagger';
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
    example: VerificationStatus.Approved,
  })
  status?: VerificationStatus;
}
