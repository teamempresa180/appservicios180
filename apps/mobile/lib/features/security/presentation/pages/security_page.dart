import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mappers/security_mapper.dart';
import '../../models/security_display.dart';
import '../../repositories/mock_security_repository.dart';
import '../widgets/add_auth_method_button.dart';
import '../widgets/audit_log_section.dart';
import '../widgets/auth_method_card.dart';
import '../widgets/credentials_section.dart';
import '../widgets/security_empty_state.dart';
import '../widgets/security_header.dart';
import '../widgets/security_loading.dart';
import '../widgets/security_statistics.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum SecurityViewState { loading, empty, information }

/// Security screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Settings`).
/// Completely independent: its own repository, its own mock data.
///
/// Shows a fixed list of authentication methods (no id-based lookup
/// yet) — see the feature README.
class SecurityPage extends StatelessWidget {
  const SecurityPage({super.key, this.state = SecurityViewState.information});

  final SecurityViewState state;

  SecurityDisplay _buildData() {
    return SecurityMapper.toDisplay(MockSecurityRepository());
  }

  Widget _buildBody(SecurityDisplay data) {
    switch (state) {
      case SecurityViewState.loading:
        return const SecurityLoading();
      case SecurityViewState.empty:
        return const SecurityEmptyState();
      case SecurityViewState.information:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: SecurityStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            Column(
              children: [
                for (final (index, authMethod) in data.authMethods.indexed) ...[
                  FadeIn(
                    delay: staggerDelayFor(index),
                    child: SlideIn(
                      child: AuthMethodCard(authMethod: authMethod),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.space12),
                ],
              ],
            ),
            const AddAuthMethodButton(),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: CredentialsSection(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: AuditLogSection(data: data)),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final data = _buildData();

    return AppPageBody(
      header: SecurityHeader(data: data),
      body: _buildBody(data),
    );
  }
}
