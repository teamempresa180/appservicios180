import 'package:flutter/material.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_quote_data.dart';
import '../../models/quote_data.dart';
import '../../repositories/mock_quote_repository.dart';
import '../widgets/address_resume.dart';
import '../widgets/confirm_quote_button.dart';
import '../widgets/estimated_time.dart';
import '../widgets/price_breakdown.dart';
import '../widgets/provider_resume.dart';
import '../widgets/quote_header.dart';
import '../widgets/quote_notes.dart';
import '../widgets/schedule_resume.dart';
import '../widgets/service_resume.dart';

/// Quote screen. Does NOT build its own `Scaffold` — it is meant to be
/// inserted into the existing navigation flow later, the same way
/// every other feature so far does. Completely independent: its own
/// repository, its own mock data.
///
/// Shows a single, fixed quote (no id-based lookup yet) — see the
/// feature README.
class QuotePage extends StatelessWidget {
  const QuotePage({super.key});

  QuoteData _buildData() {
    final repository = MockQuoteRepository();

    return QuoteData(
      quote: repository.getQuote(),
      service: repository.getService(),
      provider: repository.getProvider(),
      profile: repository.getProfile(),
      category: repository.getCategory(),
      address: repository.getAddress(),
      travelFee: mockQuoteTravelFee,
      discount: mockQuoteDiscount,
      taxes: mockQuoteTaxes,
      estimatedDate: mockQuoteEstimatedDate,
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = _buildData();

    return AppPageBody(
      header: QuoteHeader(data: data),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SlideIn(child: ServiceResume(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderResume(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: AddressResume(data: data)),
          const SizedBox(height: AppSpacing.space16),
          ScaleIn(child: ScheduleResume(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: EstimatedTime(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: PriceBreakdown(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: QuoteNotes(data: data)),
          const SizedBox(height: AppSpacing.space16),
          const ConfirmQuoteButton(),
        ],
      ),
    );
  }
}
