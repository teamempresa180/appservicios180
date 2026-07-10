import 'package:flutter/material.dart';
import '../../../../contact/models/contact_type.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/profile_display.dart';

/// Recap of the real `Contact` channels (email, phone). No color/icon
/// is stored anywhere — resolved purely from `ContactType` +
/// `context.colors.*` here.
class ProfileContact extends StatelessWidget {
  const ProfileContact({super.key, required this.data});

  final ProfileDisplay data;

  IconData _iconFor(ContactType type) {
    switch (type) {
      case ContactType.email:
        return Icons.email_outlined;
      case ContactType.phone:
        return Icons.phone_outlined;
      case ContactType.other:
        return Icons.contact_page_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Contacto'),
          for (final contact in data.contacts) ...[
            Padding(
              padding: const EdgeInsets.symmetric(
                vertical: AppSpacing.space4,
              ),
              child: Row(
                children: [
                  Icon(_iconFor(contact.type), color: context.colors.primary),
                  const SizedBox(width: AppSpacing.space8),
                  Expanded(
                    child: Text(
                      contact.value,
                      overflow: TextOverflow.ellipsis,
                      style: context.textStyles.bodyMedium,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
