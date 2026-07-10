import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Contact Management screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class ContactsEmptyState extends StatelessWidget {
  const ContactsEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin contactos guardados',
      description: 'Agrega un correo o teléfono para que puedan contactarte.',
      icon: Icons.contact_mail_outlined,
    );
  }
}
