import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_spacing.dart';

/// Bottom sheet letting the user choose between camera and gallery for
/// an image pick — shared by every feature that needs a real photo
/// (profile avatar, provider selfie step). Returns the chosen
/// [ImageSource] via [Navigator.pop], or `null` if dismissed.
class ImageSourceSheet extends StatelessWidget {
  const ImageSourceSheet({super.key});

  static Future<ImageSource?> show(BuildContext context) {
    return showModalBottomSheet<ImageSource>(
      context: context,
      isScrollControlled: true,
      builder: (context) => const ImageSourceSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Seleccionar foto', style: context.textStyles.titleMedium),
            const SizedBox(height: AppSpacing.space12),
            ListTile(
              leading: Icon(Icons.camera_alt_outlined, color: context.colors.primary),
              title: const Text('Tomar foto'),
              onTap: () => Navigator.of(context).pop(ImageSource.camera),
            ),
            ListTile(
              leading: Icon(Icons.photo_library_outlined, color: context.colors.primary),
              title: const Text('Elegir de la galería'),
              onTap: () => Navigator.of(context).pop(ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
  }
}
