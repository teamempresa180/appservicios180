import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Message composer. Looks completely functional — the text field
/// accepts typing — but "Enviar" is a **no-op**: it does not send
/// anything anywhere (no backend, no sockets, no Firebase). See the
/// feature README.
class MessageInput extends StatefulWidget {
  const MessageInput({super.key, this.onSend});

  final VoidCallback? onSend;

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
          onPressed: widget.onSend ?? () {},
          icon: const Icon(Icons.send_outlined),
        ),
      ],
    );
  }
}
