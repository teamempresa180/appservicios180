import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Longest message the composer accepts — matches the field's visible
/// counter/hard cap below. Keeps a single stray tap from producing a
/// message so long it would break the bubble layout or the backend's
/// own column size for `Message.content`.
const int kMessageMaxLength = 1000;

/// Message composer. [onSend], if given, is called with the typed,
/// trimmed text and awaited — it should return `true` on a successful
/// send and `false` otherwise (matching `ChatViewModel.sendMessage`).
/// The field only clears and disables itself while a send is in
/// flight; on failure the typed text stays so nothing is lost and the
/// user can just retry.
class MessageInput extends StatefulWidget {
  const MessageInput({super.key, this.onSend, this.failureMessage});

  final Future<bool> Function(String text)? onSend;

  /// Resolves the reason the last send failed (e.g.
  /// `ChatViewModel.sendErrorMessage`), so a specific, actionable cause
  /// — "no hay conexión", a server message — reaches the user instead of
  /// the generic fallback below. Falls back when it returns `null`.
  final String? Function()? failureMessage;

  @override
  State<MessageInput> createState() => _MessageInputState();
}

class _MessageInputState extends State<MessageInput> {
  final _controller = TextEditingController();
  bool _isSending = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _isSending) return;

    if (widget.onSend == null) return;

    setState(() => _isSending = true);
    final success = await widget.onSend!(text);
    if (!mounted) return;
    setState(() => _isSending = false);

    if (success) {
      _controller.clear();
    } else {
      AppSnackBar.show(
        context,
        widget.failureMessage?.call() ??
            'No se pudo enviar el mensaje. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    }
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
            enabled: !_isSending,
            maxLines: 4,
            maxLength: kMessageMaxLength,
          ),
        ),
        const SizedBox(width: AppSpacing.space8),
        IconButton.filled(
          onPressed: _isSending ? null : _send,
          icon: _isSending
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Icon(Icons.send_outlined),
          tooltip: 'Enviar',
        ),
      ],
    );
  }
}
