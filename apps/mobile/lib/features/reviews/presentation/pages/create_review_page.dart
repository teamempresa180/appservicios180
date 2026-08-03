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

  final _formKey = GlobalKey<FormState>();
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
    // Blocks an empty comment (see `AppTextField.validator` below) —
    // the star rating can never be 0 to begin with, since every star
    // button sets it to 1-5.
    if (!(_formKey.currentState?.validate() ?? false)) return;

    final identityId = locator<SessionManager>().currentUserId;
    if (identityId == null || identityId.isEmpty) {
      // Without a session id the request would go out with an empty
      // reviewer and fail deep in the backend with an opaque error —
      // say what actually happened instead.
      AppSnackBar.show(
        context,
        'Tu sesión expiró. Vuelve a iniciar sesión para calificar.',
        type: AppSnackBarType.error,
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      await _repository.createReview(
        orderId: widget.order.id,
        providerId: widget.providerId,
        reviewerIdentityId: IdentityId.fromString(identityId),
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
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Califica tu experiencia',
                style: context.textStyles.titleMedium,
              ),
              const SizedBox(height: AppSpacing.space4),
              // Scopes the form to the real order it's rating — so it
              // never reads as an isolated, context-free screen.
              Text(widget.order.title, style: context.textStyles.bodyMedium),
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
              AppTextField(
                controller: _titleController,
                label: 'Título (opcional)',
                maxLength: 80,
              ),
              const SizedBox(height: AppSpacing.space12),
              // Multi-line with a hard cap: a review is prose, and a
              // single-line box with no limit both cramped real feedback
              // and let a paste blow past what the backend stores.
              AppTextField(
                controller: _commentController,
                label: 'Comentario',
                hint: 'Cuéntanos cómo fue el servicio',
                maxLines: 4,
                maxLength: 500,
                validator: (value) {
                  final trimmed = value?.trim() ?? '';
                  if (trimmed.isEmpty) {
                    return 'Cuéntanos brevemente cómo fue el servicio.';
                  }
                  if (trimmed.length < 5) {
                    return 'Escribe al menos unas palabras sobre el servicio.';
                  }
                  return null;
                },
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
      ),
    );
  }
}
