import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Address } from '../../../domain/entities/address.entity';
import { AddressRepository } from '../../../domain/interfaces/address-repository.interface';
import { AddressId } from '../../../domain/value-objects/address-id.value-object';

/** In-memory `AddressRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryAddressRepository implements AddressRepository {
  private readonly rows = new Map<string, Address>();

  findById(id: AddressId): Promise<Address | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Address[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.identityId.equals(identityId),
      ),
    );
  }

  save(address: Address): Promise<void> {
    this.rows.set(address.id.value, address);
    return Promise.resolve();
  }

  delete(id: AddressId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Address>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Address[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.alias.toLowerCase().includes(lower) ||
          row.fullAddress.toLowerCase().includes(lower) ||
          row.city.toLowerCase().includes(lower),
      ),
    );
  }
}
