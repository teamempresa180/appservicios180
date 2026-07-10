import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../request_service/presentation/pages/request_service_page.dart';
import '../../../trust/presentation/pages/trust_page.dart';
import '../../../verification/presentation/pages/verification_page.dart';

/// "Solicitar servicio", "Chat", "Verificación" and "Confianza"
/// actions. "Solicitar servicio" opens the (visual-only, single fixed
/// mock service/provider) Request Service screen. "Verificación" opens
/// the (visual-only, fixed mock) Verification screen. "Confianza"
/// opens the (visual-only, fixed mock) Trust screen — the only change
/// authorized in the Trust prompt. "Chat" remains a no-op — it does
/// not open a real chat yet (see the feature README).
class ProviderActions extends StatelessWidget {
  const ProviderActions({
    super.key,
    this.onRequestService,
    this.onChat,
    this.onVerification,
    this.onTrust,
  });

  final VoidCallback? onRequestService;
  final VoidCallback? onChat;
  final VoidCallback? onVerification;
  final VoidCallback? onTrust;

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
          onPressed:
              onRequestService ??
              () => Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (context) => Scaffold(
                    appBar: AppBar(title: const Text('Solicitar servicio')),
                    body: const SafeArea(child: RequestServicePage()),
                  ),
                ),
              ),
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
