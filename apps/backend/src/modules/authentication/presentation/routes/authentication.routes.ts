/**
 * Centralized route path constants for the Authentication controller.
 */
export const AuthenticationRoutes = {
  base: 'authentications',
  login: 'login',
  refresh: 'refresh',
  logout: 'logout',
  me: 'me',
  byId: ':id',
} as const;
