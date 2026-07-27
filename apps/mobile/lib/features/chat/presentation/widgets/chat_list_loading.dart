import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_loading.dart';

/// Visual-only loading state for the "Mensajes" screen. Reuses
/// `AppLoading` — no new Core UI widget.
class ChatListLoading extends StatelessWidget {
  const ChatListLoading({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: AppSpacing.space32),
      child: AppLoading(message: 'Cargando conversaciones...'),
    );
  }
}
