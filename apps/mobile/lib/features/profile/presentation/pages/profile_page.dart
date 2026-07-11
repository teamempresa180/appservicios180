import 'package:flutter/material.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_profile_data.dart';
import '../../models/profile_display.dart';
import '../../repositories/mock_profile_repository.dart';
import '../widgets/profile_actions.dart';
import '../widgets/profile_address.dart';
import '../widgets/profile_contact.dart';
import '../widgets/profile_empty_state.dart';
import '../widgets/profile_header.dart';
import '../widgets/profile_information.dart';
import '../widgets/profile_loading.dart';
import '../widgets/profile_statistics.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum ProfileViewState { loading, empty, information }

/// Profile screen. Does NOT build its own `Scaffold` — it is meant to
/// live inside the App Shell's "Perfil" slot. Completely independent:
/// its own repository, its own mock data.
///
/// Shows a single, fixed account (no id-based lookup yet) — see the
/// feature README.
class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key, this.state = ProfileViewState.information});

  final ProfileViewState state;

  ProfileDisplay _buildData() {
    final repository = MockProfileRepository();

    return ProfileDisplay(
      profile: repository.getProfile(),
      identity: repository.getIdentity(),
      contacts: repository.getContacts(),
      address: repository.getAddress(),
      completionPercentage: mockProfileCompletionPercentage,
      profileCompletionItems: mockProfileCompletionItems,
    );
  }

  Widget _buildBody() {
    switch (state) {
      case ProfileViewState.loading:
        return const ProfileLoading();
      case ProfileViewState.empty:
        return const ProfileEmptyState();
      case ProfileViewState.information:
        final data = _buildData();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SlideIn(child: ProfileInformation(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ProfileContact(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ProfileAddress(data: data)),
            const SizedBox(height: AppSpacing.space16),
            ScaleIn(child: ProfileStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            const ProfileActions(),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: ProfileHeader(data: _buildData()),
      body: _buildBody(),
    );
  }
}
