import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Profile } from '../../../domain/entities/profile.entity';
import { ProfileRepository } from '../../../domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../../domain/value-objects/profile-id.value-object';

/** In-memory `ProfileRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryProfileRepository implements ProfileRepository {
  private readonly rows = new Map<string, Profile>();

  findById(id: ProfileId): Promise<Profile | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Profile[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.identityId.equals(identityId),
      ),
    );
  }

  save(profile: Profile): Promise<void> {
    this.rows.set(profile.id.value, profile);
    return Promise.resolve();
  }

  delete(id: ProfileId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Profile>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Profile[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.displayName.toLowerCase().includes(lower) ||
          (row.bio?.toLowerCase().includes(lower) ?? false),
      ),
    );
  }
}
