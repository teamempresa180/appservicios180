import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';

enum _UploadStatus { none, picked, uploading, success, error }

/// A single document picker + uploader: pick a file (pdf/png/jpg,
/// 5 MB max — client-side guard; the backend independently enforces
/// its own mimetype allowlist), upload it with a progress bar, and
/// retry on failure without having to re-pick the file. Calls
/// [onUploaded] once with `true` the first time the upload succeeds —
/// the parent page uses that to know when both required documents are
/// done.
class DocumentUploadField extends StatefulWidget {
  const DocumentUploadField({
    super.key,
    required this.title,
    required this.description,
    required this.onUpload,
    required this.onUploaded,
  });

  final String title;
  final String description;

  /// Uploads the picked file. Should call [onProgress] with values in
  /// `[0, 1]` and throw on failure (caught here to drive the retry
  /// state) rather than swallowing the error.
  final Future<void> Function(
    List<int> bytes,
    String fileName,
    ValueChanged<double> onProgress,
  )
  onUpload;

  final ValueChanged<bool> onUploaded;

  static const int maxSizeBytes = 5 * 1024 * 1024;
  static const List<String> allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];

  @override
  State<DocumentUploadField> createState() => _DocumentUploadFieldState();
}

class _DocumentUploadFieldState extends State<DocumentUploadField> {
  _UploadStatus _status = _UploadStatus.none;
  String? _fileName;
  List<int>? _fileBytes;
  double _progress = 0;
  String? _errorMessage;

  Future<void> _pickFile() async {
    final result = await FilePicker.pickFiles(
      type: FileType.custom,
      allowedExtensions: DocumentUploadField.allowedExtensions,
      withData: true,
    );
    final file = result?.files.single;
    if (file == null || file.bytes == null) return;
    if (file.size > DocumentUploadField.maxSizeBytes) {
      setState(() {
        _status = _UploadStatus.error;
        _errorMessage = 'El archivo supera el tamaño máximo de 5 MB.';
      });
      return;
    }
    setState(() {
      _fileName = file.name;
      _fileBytes = file.bytes;
      _status = _UploadStatus.picked;
      _errorMessage = null;
    });
  }

  Future<void> _upload() async {
    final bytes = _fileBytes;
    final fileName = _fileName;
    if (bytes == null || fileName == null) return;
    setState(() {
      _status = _UploadStatus.uploading;
      _progress = 0;
      _errorMessage = null;
    });
    try {
      await widget.onUpload(
        bytes,
        fileName,
        (progress) {
          if (!mounted) return;
          setState(() => _progress = progress);
        },
      );
      if (!mounted) return;
      setState(() => _status = _UploadStatus.success);
      widget.onUploaded(true);
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _status = _UploadStatus.error;
        _errorMessage = 'No se pudo subir el documento. Inténtalo de nuevo.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(widget.title, style: context.textStyles.titleSmall),
          const SizedBox(height: AppSpacing.space4),
          Text(widget.description, style: context.textStyles.bodySmall),
          const SizedBox(height: AppSpacing.space12),
          if (_status == _UploadStatus.uploading) ...[
            LinearProgressIndicator(value: _progress),
            const SizedBox(height: AppSpacing.space8),
            Text(
              'Subiendo ${_fileName ?? ''}... ${(_progress * 100).round()}%',
              style: context.textStyles.bodySmall,
            ),
          ] else if (_status == _UploadStatus.success) ...[
            Row(
              children: [
                Icon(Icons.check_circle, color: context.colors.primary),
                const SizedBox(width: AppSpacing.space8),
                Expanded(
                  child: Text(
                    _fileName ?? 'Documento subido',
                    style: context.textStyles.bodyMedium,
                  ),
                ),
              ],
            ),
          ] else ...[
            if (_fileName != null) ...[
              Text(_fileName!, style: context.textStyles.bodyMedium),
              const SizedBox(height: AppSpacing.space8),
            ],
            if (_errorMessage != null) ...[
              Text(
                _errorMessage!,
                style: context.textStyles.bodySmall?.copyWith(
                  color: context.colors.error,
                ),
              ),
              const SizedBox(height: AppSpacing.space8),
            ],
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    label: _fileName == null
                        ? 'Seleccionar archivo'
                        : 'Cambiar archivo',
                    onPressed: _pickFile,
                    expand: false,
                  ),
                ),
                if (_fileName != null) ...[
                  const SizedBox(width: AppSpacing.space8),
                  Expanded(
                    child: AppButton(
                      label: _status == _UploadStatus.error
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
