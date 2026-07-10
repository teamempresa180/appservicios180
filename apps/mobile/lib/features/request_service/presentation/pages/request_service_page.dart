import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../mock/mock_request_service_data.dart';
import '../../models/request_service_data.dart';
import '../../repositories/mock_request_service_repository.dart';
import '../widgets/address_summary.dart';
import '../widgets/attachments_section.dart';
import '../widgets/continue_button.dart';
import '../widgets/priority_selector.dart';
import '../widgets/problem_description.dart';
import '../widgets/provider_summary.dart';
import '../widgets/request_service_header.dart';
import '../widgets/schedule_selector.dart';
import '../widgets/service_summary.dart';

/// Request Service screen. Does NOT build its own `Scaffold` — it is
/// meant to be inserted into the existing navigation flow later, the
/// same way every other feature so far does. Completely independent:
/// its own repository, its own mock data.
///
/// Shows a single, fixed service/provider (no id-based lookup yet) —
/// see the feature README.
class RequestServicePage extends StatelessWidget {
  const RequestServicePage({super.key});

  RequestServiceData _buildData() {
    final repository = MockRequestServiceRepository();

    return RequestServiceData(
      service: repository.getService(),
      provider: repository.getProvider(),
      profile: repository.getProfile(),
      category: repository.getCategory(),
      availability: repository.getAvailability(),
      address: repository.getAddress(),
      selectedDate: mockRequestServiceSelectedDate,
      selectedTime: mockRequestServiceSelectedTime,
      problemDescription: mockRequestServiceProblemDescription,
      attachments: mockRequestServiceAttachments,
      priority: mockRequestServicePriority,
      simulatedLocationLabel: mockRequestServiceLocationLabel,
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = _buildData();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FadeIn(child: RequestServiceHeader(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ServiceSummary(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderSummary(data: data)),
          const SizedBox(height: AppSpacing.space16),
          ScaleIn(
            child: ScheduleSelector(
              initialDate: data.selectedDate,
              initialTime: data.selectedTime,
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: AddressSummary(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(
            child: ProblemDescription(initialText: data.problemDescription),
          ),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: AttachmentsSection(attachments: data.attachments)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: PrioritySelector(initialPriority: data.priority)),
          const SizedBox(height: AppSpacing.space16),
          const ContinueButton(),
        ],
      ),
    );
  }
}
