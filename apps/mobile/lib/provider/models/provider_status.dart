/// The lifecycle status of a Provider record. [pending] is the status
/// every newly-created Provider starts in — set by the backend's
/// `CreateProviderUseCase` until its submitted verification documents
/// (criminal record + certification) are reviewed and approved.
enum ProviderStatus { pending, active, inactive, suspended, archived }
