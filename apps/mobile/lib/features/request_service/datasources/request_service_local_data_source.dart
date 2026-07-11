import '../../../address/entities/address.dart';
import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';

/// Local (on-device) source for the domain entities a Request Service
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class RequestServiceLocalDataSource {
  Service getService();
  Provider getProvider();
  Profile getProfile();
  Category getCategory();
  Availability getAvailability();
  Address getAddress();
}
