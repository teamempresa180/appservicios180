import 'package:flutter/material.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_service_detail_data.dart';
import '../../models/service_detail_data.dart';
import '../../repositories/mock_service_detail_repository.dart';
import '../widgets/provider_information.dart';
import '../widgets/rating_summary.dart';
import '../widgets/request_service_button.dart';
import '../widgets/service_detail_header.dart';
import '../widgets/service_gallery.dart';
import '../widgets/service_information.dart';

/// Service Detail screen. Does NOT build its own `Scaffold` — it is
/// meant to be inserted into the App Shell later, the same way Home,
/// Marketplace, Categories and Search already are. Completely
/// independent of those features: its own repository, its own mock
/// data.
///
/// Shows a single, fixed service (no id-based lookup yet) — see the
/// feature README.
class ServiceDetailPage extends StatelessWidget {
  const ServiceDetailPage({super.key});

  ServiceDetailData _buildData() {
    final repository = MockServiceDetailRepository();
    final reviews = repository.getReviews();
    final averageRating = reviews.isEmpty
        ? 0.0
        : reviews.map((review) => review.rating.value).reduce((a, b) => a + b) /
              reviews.length;

    return ServiceDetailData(
      service: repository.getService(),
      provider: repository.getProvider(),
      profile: repository.getProviderProfile(),
      category: repository.getCategory(),
      reviews: reviews,
      rating: averageRating,
      reviewsCount: reviews.length,
      images: mockServiceDetailImages,
      longDescription: mockServiceDetailLongDescription,
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = _buildData();

    return AppPageBody(
      header: ServiceDetailHeader(data: data),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ScaleIn(child: ServiceGallery(images: data.images)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ServiceInformation(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderInformation(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: RatingSummary(data: data)),
          const SizedBox(height: AppSpacing.space16),
          const RequestServiceButton(),
        ],
      ),
    );
  }
}
