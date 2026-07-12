import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CreateCategoryCommand } from '../commands/create-category.command';
import { UpdateCategoryCommand } from '../commands/update-category.command';
import { CategoryValidator } from './category.validator';

describe('CategoryValidator', () => {
  function validCommand(
    overrides: Partial<{ name: string; type: CategoryType }> = {},
  ): CreateCategoryCommand {
    return new CreateCategoryCommand(
      overrides.name ?? 'Plumbing',
      'desc',
      'icon',
      '#000',
      overrides.type ?? CategoryType.Standard,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        CategoryValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank name', () => {
      expect(() =>
        CategoryValidator.validateCreate(validCommand({ name: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        CategoryValidator.validateCreate(
          validCommand({ type: 'INVALID' as CategoryType }),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        CategoryValidator.validateUpdate(
          new UpdateCategoryCommand(
            'id-1',
            'New Name',
            'New description',
            CategoryStatus.Active,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        CategoryValidator.validateUpdate(new UpdateCategoryCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a blank name when provided', () => {
      expect(() =>
        CategoryValidator.validateUpdate(
          new UpdateCategoryCommand('id-1', '   '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        CategoryValidator.validateUpdate(
          new UpdateCategoryCommand(
            'id-1',
            undefined,
            undefined,
            'INVALID' as CategoryStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
