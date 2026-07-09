import 'package:flutter/material.dart';

/// Plain data describing a single Onboarding slide. No business meaning —
/// purely presentational content consumed by the Onboarding flow.
class OnboardingSlide {
  const OnboardingSlide({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;
}
