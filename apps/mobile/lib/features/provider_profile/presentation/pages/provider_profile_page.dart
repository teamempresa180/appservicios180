import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../mock/mock_provider_profile_data.dart';
import '../../models/provider_profile_data.dart';
import '../../repositories/mock_provider_profile_repository.dart';
import '../widgets/provider_actions.dart';
import '../widgets/provider_availability.dart';
import '../widgets/provider_information.dart';
import '../widgets/provider_profile_header.dart';
import '../widgets/provider_reviews_summary.dart';
import '../widgets/provider_services.dart';
import '../widgets/provider_specialties.dart';
import '../widgets/provider_statistics.dart';

/// Provider Profile screen. Does NOT build its own `Scaffold` — it is
/// meant to be inserted into the existing navigation flow later, the
/// same way every other feature so far does. Completely independent:
/// its own repository, its own mock data.
///
/// Shows a single, fixed provider (no id-based lookup yet) — see the
/// feature README.
class ProviderProfilePage extends StatelessWidget {
  const ProviderProfilePage({super.key});

  ProviderProfileData _buildData() {
    final repository = MockProviderProfileRepository();
    final reviews = repository.getReviews();
    final averageRating = reviews.isEmpty
        ? 0.0
        : reviews.map((review) => review.rating.value).reduce((a, b) => a + b) /
              reviews.length;

    return ProviderProfileData(
      provider: repository.getProvider(),
      profile: repository.getProfile(),
      availability: repository.getAvailability(),
      reviews: reviews,
      services: repository.getServices(),
      categories: repository.getCategories(),
      rating: averageRating,
      reviewsCount: reviews.length,
      completedServices: mockProviderProfileCompletedServices,
      responseTime: mockProviderProfileResponseTime,
      coverImages: mockProviderProfileCoverImages,
      about: mockProviderProfileAbout,
      specialties: mockProviderProfileSpecialties,
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = _buildData();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FadeIn(child: ProviderProfileHeader(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderInformation(data: data)),
          const SizedBox(height: AppSpacing.space16),
          ScaleIn(child: ProviderStatistics(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderSpecialties(specialties: data.specialties)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderServices(services: data.services)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderAvailability(availability: data.availability)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderReviewsSummary(data: data)),
          const SizedBox(height: AppSpacing.space16),
          const ProviderActions(),
        ],
      ),
    );
  }
}
