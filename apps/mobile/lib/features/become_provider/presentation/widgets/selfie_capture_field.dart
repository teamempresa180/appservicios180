import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';

enum _SelfieStatus { none, picked, uploading, success, error }

/// Step 1 of the provider registration wizard: a camera-only selfie
/// (front camera, no gallery — this must be a real photo taken now,
/// not an existing picture) uploaded as the account's `Profile.avatarUrl`
/// (see `BecomeProviderPage._uploadSelfie`, which wires [onUpload] to
/// `ProfileRepository.updateAvatar` — there is no dedicated "selfie
/// verification" field on the domain, and the photo doubles as the
/// account's profile picture, which is a reasonable real use for it).
class SelfieCaptureField extends StatefulWidget {
  const SelfieCaptureField({
    super.key,
    required this.onUpload,
    required this.onUploaded,
  });

  /// Uploads the captured selfie. Should throw on failure (caught here
  /// to drive the retry state) rather than swallowing the error.
  final Future<void> Function(List<int> bytes, String fileName) onUpload;

  final ValueChanged<bool> onUploaded;

  @override
  State<SelfieCaptureField> createState() => _SelfieCaptureFieldState();
}

class _SelfieCaptureFieldState extends State<SelfieCaptureField> {
  _SelfieStatus _status = _SelfieStatus.none;
  Uint8List? _bytes;
  String? _fileName;
  String? _errorMessage;

  Future<void> _capture() async {
    final picked = await ImagePicker().pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.front,
      maxWidth: 1024,
      imageQuality: 85,
    );
    if (picked == null) return;
    final bytes = await picked.readAsBytes();
    setState(() {
      _bytes = bytes;
      _fileName = picked.name;
      _status = _SelfieStatus.picked;
      _errorMessage = null;
    });
  }

  Future<void> _upload() async {
    final bytes = _bytes;
    final fileName = _fileName;
    if (bytes == null || fileName == null) return;
    setState(() {
      _status = _SelfieStatus.uploading;
      _errorMessage = null;
    });
    try {
      await widget.onUpload(bytes, fileName);
      if (!mounted) return;
      setState(() => _status = _SelfieStatus.success);
      widget.onUploaded(true);
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _status = _SelfieStatus.error;
        _errorMessage = 'No se pudo subir la foto. Inténtalo de nuevo.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Foto de tu rostro', style: context.textStyles.titleSmall),
          const SizedBox(height: AppSpacing.space4),
          Text(
            'Tómate una selfie clara, con buena luz y sin accesorios que '
            'cubran tu rostro. La usaremos para verificar tu identidad.',
            style: context.textStyles.bodySmall,
          ),
          const SizedBox(height: AppSpacing.space12),
          if (_bytes != null)
            Center(
              child: CircleAvatar(
                radius: AppSpacing.space64,
                backgroundImage: MemoryImage(_bytes!),
              ),
            ),
          const SizedBox(height: AppSpacing.space12),
          if (_status == _SelfieStatus.uploading)
            const Center(child: CircularProgressIndicator())
          else ...[
            if (_errorMessage != null) ...[
              Text(
                _errorMessage!,
                style: context.textStyles.bodySmall?.copyWith(
                  color: context.colors.error,
                ),
              ),
              const SizedBox(height: AppSpacing.space8),
            ],
            if (_status == _SelfieStatus.success)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle, color: context.colors.primary),
                  const SizedBox(width: AppSpacing.space8),
                  Text('Foto subida', style: context.textStyles.bodyMedium),
                ],
              )
            else
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      label: _bytes == null ? 'Tomar foto' : 'Tomar de nuevo',
                      onPressed: _capture,
                      expand: false,
                    ),
                  ),
                  if (_bytes != null) ...[
                    const SizedBox(width: AppSpacing.space8),
                    Expanded(
                      child: AppButton(
                        label: _status == _SelfieStatus.error
                            ? 'Reintentar'
                            : 'Subir',
                        onPressed: _upload,
                        expand: false,
                      ),
                    ),
                  ],
                ],
              ),
          ],
        ],
      ),
    );
  }
}
