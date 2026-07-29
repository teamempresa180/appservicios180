import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Message composer. The text field accepts typing; "Enviar" clears
/// the field and gives visible feedback — it still doesn't persist
/// anywhere (no backend endpoint to send a Message exists yet, see the
/// feature README), but tapping it always does something instead of
/// silently doing nothing. [onSend], if given, is called with the
/// typed text before the field is cleared.
class MessageInput extends StatefulWidget {
  const MessageInput({super.key, this.onSend});

  final ValueChanged<String>? onSend;

  @override
  State<MessageInput> createState() => _MessageInputState();
}

class _MessageInputState extends State<MessageInput> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    widget.onSend?.call(text);
    _controller.clear();
    AppSnackBar.show(context, 'Mensaje enviado', type: AppSnackBarType.success);
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: AppTextField(
            controller: _controller,
            hint: 'Escribe un mensaje...',
          ),
        ),
        const SizedBox(width: AppSpacing.space8),
        IconButton.filled(
          onPressed: _send,
          icon: const Icon(Icons.send_outlined),
          tooltip: 'Enviar',
        ),
      ],
    );
  }
}
