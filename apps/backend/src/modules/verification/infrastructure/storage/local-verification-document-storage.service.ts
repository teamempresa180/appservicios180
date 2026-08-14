import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { VerificationValidator } from '../../application/validators/verification.validator';

/** Minimal shape this service needs from Multer's uploaded-file object —
 *  avoids depending on `Express.Multer.File`'s full surface (or on
 *  `@types/multer` augmenting the global namespace) outside the
 *  controller boundary. */
export interface UploadedVerificationDocumentFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

/**
 * Writes an uploaded Verification document to local disk under
 * `uploads/verifications/<verificationId>/<sanitized-filename>`
 * (relative to the backend project root, i.e. `process.cwd()` when the
 * app is started, same as every other relative path this project
 * resolves — e.g. Prisma's `.env` loading in `main.ts`). Not a
 * `VerificationRepository` concern (that interface only persists the
 * domain entity's fields) and not something `UploadVerificationDocumentUseCase`
 * should do either — mixing raw multipart/filesystem handling into the
 * Application layer would make it depend on Node's `fs` module, which
 * every other use case in this module avoids. Instead the controller
 * calls this infrastructure service first to obtain the relative path,
 * then passes that path into the use case exactly like any other
 * command field.
 */
@Injectable()
export class LocalVerificationDocumentStorageService {
  private readonly uploadsRoot = join(
    process.cwd(),
    'uploads',
    'verifications',
  );

  async save(
    verificationId: string,
    file: UploadedVerificationDocumentFile,
  ): Promise<string> {
    // Two checks, in order: the declared `Content-Type` must be on the
    // allow-list, and the file's real leading bytes must match it. The
    // first alone is spoofable — a caller controls its own headers.
    VerificationValidator.validateDocumentMimeType(file.mimetype);
    VerificationValidator.validateDocumentSignature(file.mimetype, file.buffer);

    const sanitizedName =
      LocalVerificationDocumentStorageService.sanitizeFileName(
        file.originalname,
      );
    if (!sanitizedName) {
      throw new ValidationException('file name is required');
    }

    const targetDir = join(this.uploadsRoot, verificationId);
    await mkdir(targetDir, { recursive: true });
    await writeFile(join(targetDir, sanitizedName), file.buffer);

    // Forward slashes regardless of OS — this path is also the URL path
    // segment served under `/uploads` (see `main.ts`), and URLs always
    // use `/`.
    return `uploads/verifications/${verificationId}/${sanitizedName}`;
  }

  /** Strips path separators and any leading dots so the original
   *  filename can never escape `targetDir` (e.g. `../../etc/passwd`)
   *  or resolve to a hidden dotfile. */
  private static sanitizeFileName(originalName: string): string {
    return originalName.replace(/[/\\]/g, '_').replace(/^\.+/, '').trim();
  }
}
