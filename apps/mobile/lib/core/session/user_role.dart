/// The two roles a session can act as — Cliente (requests services) or
/// Prestador de servicios (offers them). Switched from the App Shell's
/// side drawer (InDrive-style "cambiar a conductor" pattern), see
/// `UserRoleController`. Determines which Home layout is shown.
enum UserRole { client, provider }
