import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/contact_management_display.dart';
import '../../repositories/mock_contact_management_repository.dart';
import '../widgets/add_contact_button.dart';
import '../widgets/contact_card.dart';
import '../widgets/contacts_empty_state.dart';
import '../widgets/contacts_header.dart';
import '../widgets/contacts_loading.dart';
import '../widgets/contacts_statistics.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum ContactManagementViewState { loading, empty, information }

/// Contact Management screen. Does NOT build its own `Scaffold` — it
/// is meant to live within the existing navigation flow (opened from
/// `Settings`). Completely independent: its own repository, its own
/// mock data.
///
/// Shows a fixed list of contacts (no id-based lookup yet) — see the
/// feature README.
class ContactManagementPage extends StatelessWidget {
  const ContactManagementPage({
    super.key,
    this.state = ContactManagementViewState.information,
  });

  final ContactManagementViewState state;

  ContactManagementDisplay _buildData() {
    final repository = MockContactManagementRepository();

    return ContactManagementDisplay(
      profile: repository.getProfile(),
      contacts: repository.getContacts(),
    );
  }

  Widget _buildBody() {
    switch (state) {
      case ContactManagementViewState.loading:
        return const ContactsLoading();
      case ContactManagementViewState.empty:
        return const ContactsEmptyState();
      case ContactManagementViewState.information:
        final data = _buildData();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ContactsStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(
              child: Column(
                children: [
                  for (final contact in data.contacts) ...[
                    ContactCard(contact: contact),
                    const SizedBox(height: AppSpacing.space12),
                  ],
                ],
              ),
            ),
            const AddContactButton(),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const FadeIn(child: ContactsHeader()),
          const SizedBox(height: AppSpacing.space16),
          _buildBody(),
        ],
      ),
    );
  }
}
