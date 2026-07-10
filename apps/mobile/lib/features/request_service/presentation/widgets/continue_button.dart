import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../quote/presentation/pages/quote_page.dart';

/// "Continuar" call to action. Opens the (visual-only, single fixed
/// mock quote) Quote screen — the only change authorized in the Quote
/// prompt. Purely visual — it does not create a Quote/Order or send
/// anything anywhere yet (see the feature README).
class ContinueButton extends StatelessWidget {
  const ContinueButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(
      label: 'Continuar',
      onPressed:
          onPressed ??
          () => Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (context) => Scaffold(
                appBar: AppBar(title: const Text('Cotización')),
                body: const SafeArea(child: QuotePage()),
              ),
            ),
          ),
    );
  }
}
