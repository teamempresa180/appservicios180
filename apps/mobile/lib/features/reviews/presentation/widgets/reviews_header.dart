import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Reviews title. No new Core UI widget — reuses `AppSectionTitle`.
class ReviewsHeader extends StatelessWidget {
  const ReviewsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Reseñas',
      subtitle: 'Calificaciones y comentarios de tus servicios',
    );
  }
}
