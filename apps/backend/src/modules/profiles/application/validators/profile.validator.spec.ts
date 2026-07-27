import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { CreateProfileCommand } from '../commands/create-profile.command';
import { UpdateProfileCommand } from '../commands/update-profile.command';
import { UpdateProfileAvatarCommand } from '../commands/update-profile-avatar.command';
import { ProfileValidator } from './profile.validator';

describe('ProfileValidator', () => {
  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ProfileValidator.validateCreate(
          new CreateProfileCommand(
            'identity-1',
            'Ana',
            null,
            null,
            ProfileVisibility.Public,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        ProfileValidator.validateCreate(
          new CreateProfileCommand(
            '  ',
            'Ana',
            null,
            null,
            ProfileVisibility.Public,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a blank displayName', () => {
      expect(() =>
        ProfileValidator.validateCreate(
          new CreateProfileCommand(
            'identity-1',
            '   ',
            null,
            null,
            ProfileVisibility.Public,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid visibility', () => {
      expect(() =>
        ProfileValidator.validateCreate(
          new CreateProfileCommand(
            'identity-1',
            'Ana',
            null,
            null,
            'INVALID' as ProfileVisibility,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ProfileValidator.validateUpdate(
          new UpdateProfileCommand(
            'id-1',
            'New Name',
            ProfileVisibility.Private,
            ProfileStatus.Active,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ProfileValidator.validateUpdate(new UpdateProfileCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a blank displayName when provided', () => {
      expect(() =>
        ProfileValidator.validateUpdate(
          new UpdateProfileCommand('id-1', '   '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid visibility when provided', () => {
      expect(() =>
        ProfileValidator.validateUpdate(
          new UpdateProfileCommand(
            'id-1',
            undefined,
            'INVALID' as ProfileVisibility,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        ProfileValidator.validateUpdate(
          new UpdateProfileCommand(
            'id-1',
            undefined,
            undefined,
            'INVALID' as ProfileStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdateAvatar', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ProfileValidator.validateUpdateAvatar(
          new UpdateProfileAvatarCommand(
            'id-1',
            'uploads/profiles/id-1/avatar.png',
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ProfileValidator.validateUpdateAvatar(
          new UpdateProfileAvatarCommand('  ', 'uploads/profiles/id-1/avatar.png'),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a blank avatarUrl', () => {
      expect(() =>
        ProfileValidator.validateUpdateAvatar(
          new UpdateProfileAvatarCommand('id-1', '  '),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateAvatarMimeType', () => {
    it('accepts image/png', () => {
      expect(() =>
        ProfileValidator.validateAvatarMimeType('image/png'),
      ).not.toThrow();
    });

    it('accepts image/jpeg', () => {
      expect(() =>
        ProfileValidator.validateAvatarMimeType('image/jpeg'),
      ).not.toThrow();
    });

    it('rejects application/pdf', () => {
      expect(() =>
        ProfileValidator.validateAvatarMimeType('application/pdf'),
      ).toThrow(ValidationException);
    });

    it('rejects an undefined mimetype', () => {
      expect(() =>
        ProfileValidator.validateAvatarMimeType(undefined),
      ).toThrow(ValidationException);
    });
  });
});
