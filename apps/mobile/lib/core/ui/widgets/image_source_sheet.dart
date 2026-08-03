import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_spacing.dart';
import 'app_bottom_sheet.dart';

/// Bottom sheet letting the user choose between camera and gallery for
/// an image pick — shared by every feature that needs a real photo
/// (profile avatar, provider selfie step). Returns the chosen
/// [ImageSource] via [Navigator.pop], or `null` if dismissed.
class ImageSourceSheet extends StatelessWidget {
  const ImageSourceSheet({super.key});

  /// Routed through [AppBottomSheet.show] rather than calling
  /// `showModalBottomSheet` directly — the raw call inherited Material's
  /// default sheet shape, so this was the one sheet in the app rendering
  /// without the branded radius-20 top corners, the drag handle and
  /// `AppElevation.level4`. `AppBottomSheet` also supplies the
  /// `SafeArea`, padding and scroll/height handling this widget used to
  /// repeat by hand.
  static Future<ImageSource?> show(BuildContext context) {
    return AppBottomSheet.show<ImageSource>(
      context,
      child: const ImageSourceSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Seleccionar foto', style: context.textStyles.titleMedium),
        const SizedBox(height: AppSpacing.space12),
        ListTile(
          contentPadding: EdgeInsets.zero,
          leading: Icon(
            Icons.camera_alt_outlined,
            color: context.colors.primary,
          ),
          title: const Text('Tomar foto'),
          onTap: () => Navigator.of(context).pop(ImageSource.camera),
        ),
        ListTile(
          contentPadding: EdgeInsets.zero,
          leading: Icon(
            Icons.photo_library_outlined,
            color: context.colors.primary,
          ),
          title: const Text('Elegir de la galería'),
          onTap: () => Navigator.of(context).pop(ImageSource.gallery),
        ),
      ],
    );
  }
}
