import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Solicitar servicio" and "Chat" actions. Purely visual — neither
/// creates an Order/Quote nor opens a real chat yet (see the feature
/// README).
class ProviderActions extends StatelessWidget {
  const ProviderActions({
    super.key,
    this.onRequestService,
    this.onChat,
  });

  final VoidCallback? onRequestService;
  final VoidCallback? onChat;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppButton(
          label: 'Solicitar servicio',
          onPressed: onRequestService ?? () {},
        ),
        const SizedBox(height: AppSpacing.space8),
        AppButton(label: 'Chat', onPressed: onChat ?? () {}),
      ],
    );
  }
}
