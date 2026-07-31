/**
 * Intent to list all Specializations belonging to a Category. Plain
 * data — no behavior.
 */
export class ListCategorySpecializationsQuery {
  constructor(public readonly categoryId: string) {}
}
