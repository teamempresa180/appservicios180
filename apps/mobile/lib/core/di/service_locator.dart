import 'package:get_it/get_it.dart';
import '../network/api_client.dart';
import '../network/api_config.dart';
import '../network/token_provider.dart';
import '../session/auth_repository.dart';
import '../session/http_auth_repository.dart';
import '../session/mock_auth_repository.dart';
import '../session/session_manager.dart';
import '../storage/secure_token_storage.dart';
import '../../features/address_management/repositories/address_management_repository.dart';
import '../../features/address_management/repositories/http_address_management_repository.dart';
import '../../features/address_management/repositories/mock_address_management_repository.dart';
import '../../features/availability/repositories/availability_repository.dart';
import '../../features/availability/repositories/http_availability_repository.dart';
import '../../features/availability/repositories/mock_availability_repository.dart';
import '../../features/categories/repositories/category_repository.dart';
import '../../features/categories/repositories/http_category_repository.dart';
import '../../features/categories/repositories/mock_category_repository.dart';
import '../../features/chat/repositories/chat_repository.dart';
import '../../features/chat/repositories/http_chat_repository.dart';
import '../../features/chat/repositories/mock_chat_repository.dart';
import '../../features/contact_management/repositories/contact_management_repository.dart';
import '../../features/contact_management/repositories/http_contact_management_repository.dart';
import '../../features/contact_management/repositories/mock_contact_management_repository.dart';
import '../../features/marketplace/repositories/category_repository.dart' as marketplace;
import '../../features/marketplace/repositories/http_category_repository.dart' as marketplace;
import '../../features/marketplace/repositories/http_provider_repository.dart' as marketplace;
import '../../features/marketplace/repositories/http_service_repository.dart' as marketplace;
import '../../features/marketplace/repositories/mock_category_repository.dart' as marketplace;
import '../../features/marketplace/repositories/mock_provider_repository.dart' as marketplace;
import '../../features/marketplace/repositories/mock_service_repository.dart' as marketplace;
import '../../features/marketplace/repositories/provider_repository.dart' as marketplace;
import '../../features/marketplace/repositories/service_repository.dart' as marketplace;
import '../../features/notifications/repositories/http_notifications_repository.dart';
import '../../features/notifications/repositories/mock_notifications_repository.dart';
import '../../features/notifications/repositories/notifications_repository.dart';
import '../../features/orders/repositories/http_orders_repository.dart';
import '../../features/orders/repositories/mock_orders_repository.dart';
import '../../features/orders/repositories/orders_repository.dart';
import '../../features/payments/repositories/http_payments_repository.dart';
import '../../features/payments/repositories/mock_payments_repository.dart';
import '../../features/payments/repositories/payments_repository.dart';
import '../../features/profile/repositories/http_profile_repository.dart';
import '../../features/profile/repositories/mock_profile_repository.dart';
import '../../features/profile/repositories/profile_repository.dart';
import '../../features/provider_dashboard/repositories/http_provider_dashboard_repository.dart';
import '../../features/provider_dashboard/repositories/mock_provider_dashboard_repository.dart';
import '../../features/provider_dashboard/repositories/provider_dashboard_repository.dart';
import '../../features/provider_profile/repositories/http_provider_profile_repository.dart';
import '../../features/provider_profile/repositories/mock_provider_profile_repository.dart';
import '../../features/provider_profile/repositories/provider_profile_repository.dart';
import '../../features/provider_services/repositories/http_provider_services_repository.dart';
import '../../features/provider_services/repositories/mock_provider_services_repository.dart';
import '../../features/provider_services/repositories/provider_services_repository.dart';
import '../../features/quote/repositories/http_quote_repository.dart';
import '../../features/quote/repositories/mock_quote_repository.dart';
import '../../features/quote/repositories/quote_repository.dart';
import '../../features/request_service/repositories/http_request_service_repository.dart';
import '../../features/request_service/repositories/mock_request_service_repository.dart';
import '../../features/request_service/repositories/request_service_repository.dart';
import '../../features/reviews/repositories/http_reviews_repository.dart';
import '../../features/reviews/repositories/mock_reviews_repository.dart';
import '../../features/reviews/repositories/reviews_repository.dart';
import '../../features/schedule/repositories/http_schedule_repository.dart';
import '../../features/schedule/repositories/mock_schedule_repository.dart';
import '../../features/schedule/repositories/schedule_repository.dart';
import '../../features/search/repositories/http_search_repository.dart';
import '../../features/search/repositories/mock_search_repository.dart';
import '../../features/search/repositories/search_repository.dart';
import '../../features/security/repositories/http_security_repository.dart';
import '../../features/security/repositories/mock_security_repository.dart';
import '../../features/security/repositories/security_repository.dart';
import '../../features/service_detail/repositories/http_service_detail_repository.dart';
import '../../features/service_detail/repositories/mock_service_detail_repository.dart';
import '../../features/service_detail/repositories/service_detail_repository.dart';
import '../../features/settings/repositories/http_settings_repository.dart';
import '../../features/settings/repositories/mock_settings_repository.dart';
import '../../features/settings/repositories/settings_repository.dart';
import '../../features/trust/repositories/http_trust_repository.dart';
import '../../features/trust/repositories/mock_trust_repository.dart';
import '../../features/trust/repositories/trust_repository.dart';
import '../../features/verification/repositories/http_verification_repository.dart';
import '../../features/verification/repositories/mock_verification_repository.dart';
import '../../features/verification/repositories/verification_repository.dart';

/// App-wide service locator (`get_it`). Registered once in `main()`
/// before `runApp`. Resolution order matters: [TokenProviderHolder] is
/// registered before [ApiClient] (which needs it), and [SessionManager]
/// is attached to the holder only after all of its own dependencies
/// (which themselves need [ApiClient]) are built — see
/// [TokenProviderHolder] for why this indirection exists.
///
/// Every repository below resolves to its offline `Mock...`
/// implementation or its real `Http...` implementation depending on
/// [ApiConfig.useMockBackend] — see that flag for how to reconnect to a
/// real backend.
final GetIt locator = GetIt.instance;

void setupServiceLocator() {
  final tokenProviderHolder = TokenProviderHolder();
  locator.registerSingleton<TokenProviderHolder>(tokenProviderHolder);

  final apiClient = ApiClient(tokenProviderHolder);
  locator.registerSingleton<ApiClient>(apiClient);

  locator.registerSingleton<SecureTokenStorage>(SecureTokenStorage());

  locator.registerSingleton<AuthRepository>(
    ApiConfig.useMockBackend
        ? MockAuthRepository()
        : HttpAuthRepository(apiClient),
  );

  final sessionManager = SessionManager(
    authRepository: locator<AuthRepository>(),
    tokenStorage: locator<SecureTokenStorage>(),
  );
  tokenProviderHolder.attach(sessionManager);
  locator.registerSingleton<SessionManager>(sessionManager);

  // Pilot modules (Prompt 75).
  locator.registerSingleton<CategoryRepository>(
    ApiConfig.useMockBackend
        ? MockCategoryRepository()
        : HttpCategoryRepository(apiClient),
  );
  locator.registerSingleton<OrdersRepository>(
    ApiConfig.useMockBackend
        ? MockOrdersRepository()
        : HttpOrdersRepository(apiClient),
  );
  locator.registerSingleton<ChatRepository>(
    ApiConfig.useMockBackend
        ? MockChatRepository()
        : HttpChatRepository(apiClient),
  );

  // Remaining modules (Prompt 76) — identity/account cluster.
  locator.registerSingleton<ProfileRepository>(
    ApiConfig.useMockBackend
        ? MockProfileRepository()
        : HttpProfileRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<ContactManagementRepository>(
    ApiConfig.useMockBackend
        ? MockContactManagementRepository()
        : HttpContactManagementRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<AddressManagementRepository>(
    ApiConfig.useMockBackend
        ? MockAddressManagementRepository()
        : HttpAddressManagementRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<TrustRepository>(
    ApiConfig.useMockBackend
        ? MockTrustRepository()
        : HttpTrustRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<VerificationRepository>(
    ApiConfig.useMockBackend
        ? MockVerificationRepository()
        : HttpVerificationRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<SettingsRepository>(
    ApiConfig.useMockBackend
        ? MockSettingsRepository()
        : HttpSettingsRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<SecurityRepository>(
    ApiConfig.useMockBackend
        ? MockSecurityRepository()
        : HttpSecurityRepository(apiClient, sessionManager),
  );

  // Provider ecosystem.
  locator.registerSingleton<AvailabilityRepository>(
    ApiConfig.useMockBackend
        ? MockAvailabilityRepository()
        : HttpAvailabilityRepository(apiClient),
  );
  locator.registerSingleton<ScheduleRepository>(
    ApiConfig.useMockBackend
        ? MockScheduleRepository()
        : HttpScheduleRepository(apiClient),
  );
  locator.registerSingleton<ProviderDashboardRepository>(
    ApiConfig.useMockBackend
        ? MockProviderDashboardRepository()
        : HttpProviderDashboardRepository(apiClient),
  );
  locator.registerSingleton<ProviderProfileRepository>(
    ApiConfig.useMockBackend
        ? MockProviderProfileRepository()
        : HttpProviderProfileRepository(apiClient),
  );
  locator.registerSingleton<ProviderServicesRepository>(
    ApiConfig.useMockBackend
        ? MockProviderServicesRepository()
        : HttpProviderServicesRepository(apiClient),
  );
  locator.registerSingleton<ServiceDetailRepository>(
    ApiConfig.useMockBackend
        ? MockServiceDetailRepository()
        : HttpServiceDetailRepository(apiClient),
  );

  // Marketplace (3 distinct repository interfaces, aliased to avoid
  // colliding with `features/categories`' own `CategoryRepository`).
  locator.registerSingleton<marketplace.CategoryRepository>(
    ApiConfig.useMockBackend
        ? marketplace.MockCategoryRepository()
        : marketplace.HttpMarketplaceCategoryRepository(apiClient),
  );
  locator.registerSingleton<marketplace.ProviderRepository>(
    ApiConfig.useMockBackend
        ? marketplace.MockProviderRepository()
        : marketplace.HttpMarketplaceProviderRepository(apiClient),
  );
  locator.registerSingleton<marketplace.ServiceRepository>(
    ApiConfig.useMockBackend
        ? marketplace.MockServiceRepository()
        : marketplace.HttpMarketplaceServiceRepository(apiClient),
  );

  // Marketplace + transactions cluster.
  locator.registerSingleton<SearchRepository>(
    ApiConfig.useMockBackend
        ? MockSearchRepository()
        : HttpSearchRepository(apiClient),
  );
  locator.registerSingleton<QuoteRepository>(
    ApiConfig.useMockBackend
        ? MockQuoteRepository()
        : HttpQuoteRepository(apiClient),
  );
  locator.registerSingleton<PaymentsRepository>(
    ApiConfig.useMockBackend
        ? MockPaymentsRepository()
        : HttpPaymentsRepository(apiClient),
  );
  locator.registerSingleton<ReviewsRepository>(
    ApiConfig.useMockBackend
        ? MockReviewsRepository()
        : HttpReviewsRepository(apiClient),
  );
  locator.registerSingleton<NotificationsRepository>(
    ApiConfig.useMockBackend
        ? MockNotificationsRepository()
        : HttpNotificationsRepository(apiClient, sessionManager),
  );
  locator.registerSingleton<RequestServiceRepository>(
    ApiConfig.useMockBackend
        ? MockRequestServiceRepository()
        : HttpRequestServiceRepository(apiClient),
  );
}
