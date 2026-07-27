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
      buffer: Buffer.from('bytes'),
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
});
