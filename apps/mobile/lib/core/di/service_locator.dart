import 'package:get_it/get_it.dart';
import '../network/api_client.dart';
import '../network/token_provider.dart';
import '../session/auth_repository.dart';
import '../session/http_auth_repository.dart';
import '../session/session_manager.dart';
import '../storage/secure_token_storage.dart';
import '../../features/address_management/repositories/address_management_repository.dart';
import '../../features/address_management/repositories/http_address_management_repository.dart';
import '../../features/availability/repositories/availability_repository.dart';
import '../../features/availability/repositories/http_availability_repository.dart';
import '../../features/categories/repositories/category_repository.dart';
import '../../features/categories/repositories/http_category_repository.dart';
import '../../features/chat/repositories/chat_repository.dart';
import '../../features/chat/repositories/http_chat_repository.dart';
import '../../features/contact_management/repositories/contact_management_repository.dart';
import '../../features/contact_management/repositories/http_contact_management_repository.dart';
import '../../features/marketplace/repositories/category_repository.dart' as marketplace;
import '../../features/marketplace/repositories/http_category_repository.dart' as marketplace;
import '../../features/marketplace/repositories/http_provider_repository.dart' as marketplace;
import '../../features/marketplace/repositories/http_service_repository.dart' as marketplace;
import '../../features/marketplace/repositories/provider_repository.dart' as marketplace;
import '../../features/marketplace/repositories/service_repository.dart' as marketplace;
import '../../features/notifications/repositories/http_notifications_repository.dart';
import '../../features/notifications/repositories/notifications_repository.dart';
import '../../features/orders/repositories/http_orders_repository.dart';
import '../../features/orders/repositories/orders_repository.dart';
import '../../features/payments/repositories/http_payments_repository.dart';
import '../../features/payments/repositories/payments_repository.dart';
import '../../features/profile/repositories/http_profile_repository.dart';
import '../../features/profile/repositories/profile_repository.dart';
import '../../features/provider_dashboard/repositories/http_provider_dashboard_repository.dart';
import '../../features/provider_dashboard/repositories/provider_dashboard_repository.dart';
import '../../features/provider_profile/repositories/http_provider_profile_repository.dart';
import '../../features/provider_profile/repositories/provider_profile_repository.dart';
import '../../features/provider_services/repositories/http_provider_services_repository.dart';
import '../../features/provider_services/repositories/provider_services_repository.dart';
import '../../features/quote/repositories/http_quote_repository.dart';
import '../../features/quote/repositories/quote_repository.dart';
import '../../features/request_service/repositories/http_request_service_repository.dart';
import '../../features/request_service/repositories/request_service_repository.dart';
import '../../features/reviews/repositories/http_reviews_repository.dart';
import '../../features/reviews/repositories/reviews_repository.dart';
import '../../features/schedule/repositories/http_schedule_repository.dart';
import '../../features/schedule/repositories/schedule_repository.dart';
import '../../features/search/repositories/http_search_repository.dart';
import '../../features/search/repositories/search_repository.dart';
import '../../features/security/repositories/http_security_repository.dart';
import '../../features/security/repositories/security_repository.dart';
import '../../features/service_detail/repositories/http_service_detail_repository.dart';
import '../../features/service_detail/repositories/service_detail_repository.dart';
import '../../features/settings/repositories/http_settings_repository.dart';
import '../../features/settings/repositories/settings_repository.dart';
import '../../features/trust/repositories/http_trust_repository.dart';
import '../../features/trust/repositories/trust_repository.dart';
import '../../features/verification/repositories/http_verification_repository.dart';
import '../../features/verification/repositories/verification_repository.dart';

/// App-wide service locator (`get_it`). Registered once in `main()`
/// before `runApp`. Resolution order matters: [TokenProviderHolder] is
/// registered before [ApiClient] (which needs it), and [SessionManager]
/// is attached to the holder only after all of its own dependencies
/// (which themselves need [ApiClient]) are built — see
/// [TokenProviderHolder] for why this indirection exists.
///
/// Every feature repository below now resolves to its `Http...`
/// implementation — no `MockXRepository` is registered here anymore
/// (Prompt 76, Sprint 5 Etapa 2). The Mock implementations still exist
/// in each feature's `repositories/` folder purely for tests.
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

  // Pilot modules (Prompt 75).
  locator.registerSingleton<CategoryRepository>(
    HttpCategoryRepository(apiClient),
  );
  locator.registerSingleton<OrdersRepository>(HttpOrdersRepository(apiClient));
  locator.registerSingleton<ChatRepository>(HttpChatRepository(apiClient));

  // Remaining modules (Prompt 76) — identity/account cluster.
  locator.registerSingleton<ProfileRepository>(
    HttpProfileRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<ContactManagementRepository>(
    HttpContactManagementRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<AddressManagementRepository>(
    HttpAddressManagementRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<TrustRepository>(
    HttpTrustRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<VerificationRepository>(
    HttpVerificationRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<SettingsRepository>(
    HttpSettingsRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<SecurityRepository>(
    HttpSecurityRepository(apiClient, sessionManager),
  );

  // Provider ecosystem.
  locator.registerSingleton<AvailabilityRepository>(
    HttpAvailabilityRepository(apiClient),
  );
  locator.registerSingleton<ScheduleRepository>(
    HttpScheduleRepository(apiClient),
  );
  locator.registerSingleton<ProviderDashboardRepository>(
    HttpProviderDashboardRepository(apiClient),
  );
  locator.registerSingleton<ProviderProfileRepository>(
    HttpProviderProfileRepository(apiClient),
  );
  locator.registerSingleton<ProviderServicesRepository>(
    HttpProviderServicesRepository(apiClient),
  );
  locator.registerSingleton<ServiceDetailRepository>(
    HttpServiceDetailRepository(apiClient),
  );

  // Marketplace (3 distinct repository interfaces, aliased to avoid
  // colliding with `features/categories`' own `CategoryRepository`).
  locator.registerSingleton<marketplace.CategoryRepository>(
    marketplace.HttpMarketplaceCategoryRepository(apiClient),
  );
  locator.registerSingleton<marketplace.ProviderRepository>(
    marketplace.HttpMarketplaceProviderRepository(apiClient),
  );
  locator.registerSingleton<marketplace.ServiceRepository>(
    marketplace.HttpMarketplaceServiceRepository(apiClient),
  );

  // Marketplace + transactions cluster.
  locator.registerSingleton<SearchRepository>(HttpSearchRepository(apiClient));
  locator.registerSingleton<QuoteRepository>(HttpQuoteRepository(apiClient));
  locator.registerSingleton<PaymentsRepository>(
    HttpPaymentsRepository(apiClient),
  );
  locator.registerSingleton<ReviewsRepository>(
    HttpReviewsRepository(apiClient),
  );
  locator.registerSingleton<NotificationsRepository>(
    HttpNotificationsRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<RequestServiceRepository>(
    HttpRequestServiceRepository(apiClient),
  );
}
