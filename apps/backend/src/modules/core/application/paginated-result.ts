/**
 * Generic paginated result shape for any module's `list` use case.
 * Lives in `core/application` (previously reserved/empty) because it
 * has a real, immediate consumer today — every `List<X>UseCase` in
 * Identity & Access (Sprint 3, Etapa 2) returns this same shape, and
 * every future module's `list` use case will too.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
