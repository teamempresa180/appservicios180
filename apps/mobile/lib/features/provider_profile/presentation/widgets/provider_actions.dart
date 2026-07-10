import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../request_service/presentation/pages/request_service_page.dart';

/// "Solicitar servicio" and "Chat" actions. "Solicitar servicio" opens
/// the (visual-only, single fixed mock service/provider) Request
/// Service screen — the only change authorized this prompt. "Chat"
/// remains a no-op — it does not open a real chat yet (see the feature
/// README).
class ProviderActions extends StatelessWidget {
  const ProviderActions({super.key, this.onRequestService, this.onChat});

  final VoidCallback? onRequestService;
  final VoidCallback? onChat;

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
      ],
    );
  }
}
