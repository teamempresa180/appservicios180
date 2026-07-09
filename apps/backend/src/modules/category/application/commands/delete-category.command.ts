/**
 * Intent to delete an existing Category. Plain data — no behavior.
 */
export class DeleteCategoryCommand {
  constructor(public readonly id: string) {}
}
