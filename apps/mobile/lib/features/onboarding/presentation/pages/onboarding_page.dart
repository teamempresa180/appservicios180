import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/navigation/routes/app_routes.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_divider.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../models/onboarding_slide.dart';
import '../widgets/onboarding_page_indicator.dart';
import '../widgets/onboarding_slide_view.dart';

/// Swipeable Onboarding flow shown right after the Splash screen. Purely
/// presentational: no state management, no persistence, no API calls. On
/// the last slide, "Comenzar" navigates to Login.
class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  /// Content shown by the flow. To add a slide, append an entry here — no
  /// other file needs to change.
  static const List<OnboardingSlide> slides = [
    OnboardingSlide(
      icon: Icons.home_repair_service,
      title: 'Bienvenido',
      description:
          'Encuentra profesionales para cualquier servicio desde un solo '
          'lugar.',
    ),
    OnboardingSlide(
      icon: Icons.verified_user,
      title: 'Contrata con confianza',
      description:
          'Consulta perfiles, calificaciones y verifica la información '
          'antes de contratar.',
    ),
    OnboardingSlide(
      icon: Icons.phone_android,
      title: 'Todo desde una sola aplicación',
      description:
          'Solicita servicios, conversa con profesionales y administra tus '
          'solicitudes fácilmente.',
    ),
  ];

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _controller = PageController();
  int _currentPage = 0;

  bool get _isLastPage => _currentPage == OnboardingPage.slides.length - 1;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onPrimaryButtonPressed() {
    if (_isLastPage) {
      context.go(AppRoutes.login);
      return;
    }
    _controller.nextPage(duration: AppDurations.medium, curve: Curves.easeOut);
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      body: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _controller,
              itemCount: OnboardingPage.slides.length,
              onPageChanged: (index) => setState(() => _currentPage = index),
              itemBuilder: (context, index) {
                return OnboardingSlideView(slide: OnboardingPage.slides[index]);
              },
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          OnboardingPageIndicator(
            pageCount: OnboardingPage.slides.length,
            currentPage: _currentPage,
          ),
          const AppDivider(),
          AppButton(
            label: _isLastPage ? 'Comenzar' : 'Siguiente',
            onPressed: _onPrimaryButtonPressed,
          ),
        ],
      ),
    );
  }
}
