/**
 * Intent to find active Providers compatible with a Category and,
 * optionally, a specialization. Plain data — no behavior.
 */
export class FindCompatibleProvidersQuery {
  constructor(
    public readonly categoryId: string,
    public readonly specializationId?: string,
  ) {}
}
