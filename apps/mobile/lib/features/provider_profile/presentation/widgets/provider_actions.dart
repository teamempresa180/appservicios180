import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_dialog.dart';
import '../../../../service/entities/service.dart';
import '../../../request_service/presentation/pages/request_service_page.dart';
import '../../../trust/presentation/pages/trust_page.dart';
import '../../../verification/presentation/pages/verification_page.dart';
import '../../models/provider_profile_data.dart';

/// "Solicitar servicio", "Publicar solicitud abierta", "Chat",
/// "Verificación" and "Confianza" actions.
///
/// "Solicitar servicio" is a **direct hire**: if this provider offers
/// more than one real `Service`, a picker dialog lets the client choose
/// which one before opening Request Service with that real
/// `Provider`/`Service`/`Category` in hand (real data, not a fixed mock
/// — the bug this action previously had, pushing `RequestServicePage()`
/// with zero arguments, is fixed here). "Publicar solicitud abierta" is
/// the alternative **open request** entry point for the same
/// provider's category — it still opens Request Service, but without a
/// specific provider/service, so any compatible provider in that
/// category may quote it later.
///
/// "Verificación" opens the (visual-only, fixed mock) Verification
/// screen. "Confianza" opens the (visual-only, fixed mock) Trust
/// screen. "Chat" remains a no-op — there is no conversation to open
/// before an order exists yet (see the feature README).
class ProviderActions extends StatelessWidget {
  const ProviderActions({
    super.key,
    required this.data,
    this.onChat,
    this.onVerification,
    this.onTrust,
  });

  final ProviderProfileData data;
  final VoidCallback? onChat;
  final VoidCallback? onVerification;
  final VoidCallback? onTrust;

  Category? _categoryFor(Service service) {
    for (final category in data.categories) {
      if (category.id == service.categoryId) return category;
    }
    return data.categories.isNotEmpty ? data.categories.first : null;
  }

  void _openRequestService(
    BuildContext context, {
    Service? service,
    Category? category,
  }) {
    final resolvedCategory =
        category ?? (service != null ? _categoryFor(service) : null);
    if (resolvedCategory == null) return;
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Solicitar servicio')),
          body: SafeArea(
            child: RequestServicePage(
              category: resolvedCategory,
              provider: service != null ? data.provider : null,
              service: service,
              profile: service != null ? data.profile : null,
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _pickServiceAndRequest(BuildContext context) async {
    final services = data.services;
    if (services.isEmpty) return;
    if (services.length == 1) {
      _openRequestService(context, service: services.first);
      return;
    }
    final chosen = await AppDialog.show<Service>(
      context,
      title: 'Elige un servicio',
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (final service in services)
            ListTile(
              title: Text(service.name),
              subtitle: Text('\$${service.basePrice}'),
              onTap: () => Navigator.of(context).pop(service),
            ),
        ],
      ),
    );
    if (chosen != null && context.mounted) {
      _openRequestService(context, service: chosen);
    }
  }

  Future<void> _publishOpenRequest(BuildContext context) async {
    final categories = data.categories;
    if (categories.isEmpty) return;
    if (categories.length == 1) {
      _openRequestService(context, category: categories.first);
      return;
    }
    final chosen = await AppDialog.show<Category>(
      context,
      title: 'Elige una categoría',
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (final category in categories)
            ListTile(
              title: Text(category.name),
              onTap: () => Navigator.of(context).pop(category),
            ),
        ],
      ),
    );
    if (chosen != null && context.mounted) {
      _openRequestService(context, category: chosen);
    }
  }

  void _openVerification(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Verificación de identidad')),
          body: const SafeArea(child: VerificationPage()),
        ),
      ),
    );
  }

  void _openTrust(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Confianza y reputación')),
          body: const SafeArea(child: TrustPage()),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppButton(
          label: 'Solicitar servicio',
          onPressed: () => _pickServiceAndRequest(context),
        ),
        const SizedBox(height: AppSpacing.space8),
        AppButton(
          label: 'Publicar solicitud abierta',
          variant: AppButtonVariant.outlined,
          onPressed: () => _publishOpenRequest(context),
        ),
        const SizedBox(height: AppSpacing.space8),
        AppButton(label: 'Chat', onPressed: onChat ?? () {}),
        const SizedBox(height: AppSpacing.space8),
        AppButton(
          label: 'Verificación',
          onPressed: onVerification ?? () => _openVerification(context),
        ),
        const SizedBox(height: AppSpacing.space8),
        AppButton(
          label: 'Confianza',
          onPressed: onTrust ?? () => _openTrust(context),
        ),
      ],
    );
  }
}
