import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CreateCategoryCommand } from '../commands/create-category.command';
import { DeleteCategoryCommand } from '../commands/delete-category.command';
import { UpdateCategoryCommand } from '../commands/update-category.command';
import { GetCategoryQuery } from '../queries/get-category.query';
import { ListCategoryQuery } from '../queries/list-category.query';
import { SearchCategoryQuery } from '../queries/search-category.query';
import { InMemoryCategoryRepository } from './test-support/in-memory-category.repository';
import { CreateCategoryUseCase } from './create-category.use-case';
import { GetCategoryUseCase } from './get-category.use-case';
import { UpdateCategoryUseCase } from './update-category.use-case';
import { DeleteCategoryUseCase } from './delete-category.use-case';
import { ListCategoryUseCase } from './list-category.use-case';
import { SearchCategoryUseCase } from './search-category.use-case';

describe('Category use cases', () => {
  let repository: InMemoryCategoryRepository;

  beforeEach(() => {
    repository = new InMemoryCategoryRepository();
  });

  function createCommand(overrides: Partial<{ name: string }> = {}) {
    return new CreateCategoryCommand(
      overrides.name ?? 'Plumbing',
      'Pipes and water systems',
      'icon-plumbing',
      '#0000FF',
      CategoryType.Standard,
    );
  }

  describe('CreateCategoryUseCase', () => {
    it('creates a Category in Active status', async () => {
      const useCase = new CreateCategoryUseCase(repository);
      const dto = await useCase.execute(createCommand());

      expect(dto.name).toBe('Plumbing');
      expect(dto.status).toBe(CategoryStatus.Active);
    });

    it('rejects a blank name', async () => {
      const useCase = new CreateCategoryUseCase(repository);
      await expect(
        useCase.execute(createCommand({ name: '  ' })),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects an invalid type', async () => {
      const useCase = new CreateCategoryUseCase(repository);
      await expect(
        useCase.execute(
          new CreateCategoryCommand(
            'Plumbing',
            'desc',
            'icon',
            '#000',
            'INVALID' as CategoryType,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetCategoryUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetCategoryUseCase(repository).execute(
          new GetCategoryQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateCategoryUseCase', () => {
    it('updates name, description and status', async () => {
      const created = await new CreateCategoryUseCase(repository).execute(
        createCommand(),
      );

      const updated = await new UpdateCategoryUseCase(repository).execute(
        new UpdateCategoryCommand(
          created.id,
          'Plumbing Pro',
          'Updated description',
          CategoryStatus.Inactive,
        ),
      );

      expect(updated.name).toBe('Plumbing Pro');
      expect(updated.description).toBe('Updated description');
      expect(updated.status).toBe(CategoryStatus.Inactive);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateCategoryUseCase(repository).execute(
          new UpdateCategoryCommand('unknown-id', 'New Name'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteCategoryUseCase', () => {
    it('deletes an existing Category', async () => {
      const created = await new CreateCategoryUseCase(repository).execute(
        createCommand(),
      );

      await new DeleteCategoryUseCase(repository).execute(
        new DeleteCategoryCommand(created.id),
      );

      await expect(
        new GetCategoryUseCase(repository).execute(
          new GetCategoryQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteCategoryUseCase(repository).execute(
          new DeleteCategoryCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListCategoryUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateCategoryUseCase(repository);
      await createUseCase.execute(createCommand({ name: 'A' }));
      await createUseCase.execute(createCommand({ name: 'B' }));

      const page = await new ListCategoryUseCase(repository).execute(
        new ListCategoryQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchCategoryUseCase', () => {
    it('finds Categories by name', async () => {
      await new CreateCategoryUseCase(repository).execute(
        createCommand({ name: 'Special Category' }),
      );

      const results = await new SearchCategoryUseCase(repository).execute(
        new SearchCategoryQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Special Category');
    });
  });
});
