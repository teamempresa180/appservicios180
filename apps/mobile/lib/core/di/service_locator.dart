import 'package:get_it/get_it.dart';
import '../network/api_client.dart';
import '../network/token_provider.dart';
import '../session/auth_repository.dart';
import '../session/http_auth_repository.dart';
import '../session/session_manager.dart';
import '../storage/secure_token_storage.dart';
import '../../features/categories/repositories/category_repository.dart';
import '../../features/categories/repositories/http_category_repository.dart';
import '../../features/orders/repositories/orders_repository.dart';
import '../../features/orders/repositories/http_orders_repository.dart';
import '../../features/chat/repositories/chat_repository.dart';
import '../../features/chat/repositories/http_chat_repository.dart';

/// App-wide service locator (`get_it`). Registered once in `main()`
/// before `runApp`. Resolution order matters: [TokenProviderHolder] is
/// registered before [ApiClient] (which needs it), and [SessionManager]
/// is attached to the holder only after all of its own dependencies
/// (which themselves need [ApiClient]) are built — see
/// [TokenProviderHolder] for why this indirection exists.
final GetIt locator = GetIt.instance;

void setupServiceLocator() {
  final tokenProviderHolder = TokenProviderHolder();
  locator.registerSingleton<TokenProviderHolder>(tokenProviderHolder);

  final apiClient = ApiClient(tokenProviderHolder);
  locator.registerSingleton<ApiClient>(apiClient);

  locator.registerSingleton<SecureTokenStorage>(SecureTokenStorage());

  locator.registerSingleton<AuthRepository>(HttpAuthRepository(apiClient));

  final sessionManager = SessionManager(
    authRepository: locator<AuthRepository>(),
    tokenStorage: locator<SecureTokenStorage>(),
  );
  tokenProviderHolder.attach(sessionManager);
  locator.registerSingleton<SessionManager>(sessionManager);

  // Pilot modules (Sprint 5 — Flutter/backend integration). The
  // remaining feature repositories still resolve their `Mock...`
  // implementation inline in their pages, unchanged, pending Prompt 76.
  locator.registerSingleton<CategoryRepository>(
    HttpCategoryRepository(apiClient),
  );
  locator.registerSingleton<OrdersRepository>(HttpOrdersRepository(apiClient));
  locator.registerSingleton<ChatRepository>(HttpChatRepository(apiClient));
}
