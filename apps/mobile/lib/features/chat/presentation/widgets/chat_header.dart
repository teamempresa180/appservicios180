import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/chat_display.dart';

/// Chat title + subtitle (the order this conversation is tied to).
/// Reuses `AppSectionTitle`'s subtitle support — no new Core UI widget.
class ChatHeader extends StatelessWidget {
  const ChatHeader({super.key, required this.data});

  final ChatDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(title: 'Chat', subtitle: data.order.title);
  }
}
