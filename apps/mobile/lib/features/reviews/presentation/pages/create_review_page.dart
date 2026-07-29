import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/session/session_manager.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../core/ui/widgets/app_text_field.dart';
import '../../../../identity/models/identity_id.dart';
import '../../../../order/entities/order.dart';
import '../../../../provider/models/provider_id.dart';
import '../../repositories/reviews_repository.dart';

/// Real rating form — stars (1-5) + title + comment — submitted as a
/// real `Review` via `ReviewsRepository.createReview`. Scoped to the
/// real [order]/[providerId] that just completed (the client's
/// "Calificar" action on `OrderActions`, replacing the previous
/// zero-argument navigation into a read-only `ReviewsPage`).
class CreateReviewPage extends StatefulWidget {
  const CreateReviewPage({
    super.key,
    required this.order,
    required this.providerId,
    ReviewsRepository? repository,
  }) : _repository = repository;

  final Order order;
  final ProviderId providerId;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ReviewsRepository? _repository;

  @override
  State<CreateReviewPage> createState() => _CreateReviewPageState();
}

class _CreateReviewPageState extends State<CreateReviewPage> {
  late final ReviewsRepository _repository =
      widget._repository ?? locator<ReviewsRepository>();

  final _titleController = TextEditingController();
  final _commentController = TextEditingController();
  int _rating = 5;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_isSubmitting) return;
    setState(() => _isSubmitting = true);
    try {
      final identityId = locator<SessionManager>().currentUserId;
      await _repository.createReview(
        orderId: widget.order.id,
        providerId: widget.providerId,
        reviewerIdentityId: IdentityId.fromString(identityId ?? ''),
        rating: _rating,
        title: _titleController.text.trim().isEmpty
            ? 'Sin título'
            : _titleController.text.trim(),
        comment: _commentController.text.trim(),
      );
      if (!mounted) return;
      AppSnackBar.show(
        context,
        '¡Gracias por tu reseña!',
        type: AppSnackBarType.success,
      );
      Navigator.of(context).pop();
    } catch (_) {
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo enviar la reseña. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.space16),
      child: AppCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Califica tu experiencia', style: context.textStyles.titleMedium),
            const SizedBox(height: AppSpacing.space16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (var star = 1; star <= 5; star++)
                  IconButton(
                    onPressed: () => setState(() => _rating = star),
                    icon: Icon(
                      star <= _rating ? Icons.star : Icons.star_border,
                      color: context.colors.primary,
                      size: AppSpacing.space32,
                    ),
                  ),
              ],
            ),
            const SizedBox(height: AppSpacing.space16),
            AppTextField(controller: _titleController, label: 'Título'),
            const SizedBox(height: AppSpacing.space12),
            AppTextField(
              controller: _commentController,
              label: 'Comentario',
              hint: 'Cuéntanos cómo fue el servicio',
            ),
            const SizedBox(height: AppSpacing.space20),
            AppButton(
              label: 'Enviar reseña',
              isLoading: _isSubmitting,
              onPressed: _isSubmitting ? null : _submit,
            ),
          ],
        ),
      ),
    );
  }
}
