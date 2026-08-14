import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { LocalVerificationDocumentStorageService } from './local-verification-document-storage.service';

describe('LocalVerificationDocumentStorageService', () => {
  let service: LocalVerificationDocumentStorageService;
  let originalCwd: string;
  let tempCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempCwd = await mkdtemp(join(tmpdir(), 'verification-storage-'));
    process.chdir(tempCwd);
    // Constructed *after* chdir — `uploadsRoot` is computed once from
    // `process.cwd()` in the constructor, same as production startup.
    service = new LocalVerificationDocumentStorageService();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(tempCwd, { recursive: true, force: true });
  });

  it('writes the file under uploads/verifications/<id>/<name> and returns the relative path', async () => {
    const path = await service.save('verification-1', {
      originalname: 'record.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 fake content'),
    });

    expect(path).toBe('uploads/verifications/verification-1/record.pdf');
    const written = await readFile(join(tempCwd, path));
    expect(written.toString()).toBe('%PDF-1.4 fake content');
  });

  it('sanitizes a filename containing path separators', async () => {
    const path = await service.save('verification-1', {
      originalname: '../../etc/passwd.png',
      mimetype: 'image/png',
      buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]),
    });

    expect(path).toBe(
      'uploads/verifications/verification-1/_.._etc_passwd.png',
    );
  });

  it('rejects an unsupported mimetype without writing anything', async () => {
    await expect(
      service.save('verification-1', {
        originalname: 'malware.exe',
        mimetype: 'application/x-msdownload',
        buffer: Buffer.from('bytes'),
      }),
    ).rejects.toThrow(ValidationException);
  });

  // The declared `Content-Type` is on the allow-list, so the mimetype
  // check passes — only the real leading bytes give the file away.
  it('rejects a file whose bytes do not match its declared type', async () => {
    await expect(
      service.save('verification-1', {
        originalname: 'not-really.png',
        mimetype: 'image/png',
        buffer: Buffer.from('MZ\x90\x00 an executable, actually'),
      }),
    ).rejects.toThrow(ValidationException);
  });

  it('accepts a real JPEG signature', async () => {
    const path = await service.save('verification-1', {
      originalname: 'selfie.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]),
    });

    expect(path).toBe('uploads/verifications/verification-1/selfie.jpg');
  });
});
