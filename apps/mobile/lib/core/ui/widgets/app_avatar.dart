import 'dart:convert';
import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_spacing.dart';

/// Generic circular avatar placeholder. Extracted (Sprint 2, Etapa 3)
/// from ten features that each built an identical `CircleAvatar` (bg
/// `context.colors.primary`, icon `Icons.person` sized to match the
/// radius, `onPrimary` icon color) — the de facto "official" look this
/// widget now formalizes.
///
/// Shows [imageUrl] if given (a real uploaded photo — either an
/// absolute `http(s)://` URL served from the backend's `/uploads`, or
/// a `data:` URI, used by `MockProfileRepository` since it has no real
/// file storage). Falls back to [initials] (e.g. "DR"), then [icon].
class AppAvatar extends StatelessWidget {
  const AppAvatar({
    super.key,
    this.initials,
    this.icon = Icons.person,
    this.radius = AppSpacing.space24,
    this.imageUrl,
  });

  final String? initials;
  final IconData icon;
  final double radius;
  final String? imageUrl;

  ImageProvider? _resolveImage() {
    final url = imageUrl;
    if (url == null || url.isEmpty) return null;
    if (url.startsWith('data:')) {
      final base64Part = url.substring(url.indexOf(',') + 1);
      return MemoryImage(base64Decode(base64Part));
    }
    return NetworkImage(url);
  }

  @override
  Widget build(BuildContext context) {
    final image = _resolveImage();
    return CircleAvatar(
      radius: radius,
      backgroundColor: context.colors.primary,
      backgroundImage: image,
      child: image != null
          ? null
          : initials == null
          ? Icon(icon, size: radius, color: context.colors.onPrimary)
          : Text(
              initials!,
              style: context.textStyles.titleMedium?.copyWith(
                color: context.colors.onPrimary,
              ),
            ),
    );
  }
}
