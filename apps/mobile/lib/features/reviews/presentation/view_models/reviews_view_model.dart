import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../review/entities/review.dart';
import '../../mock/mock_reviews_data.dart';
import '../../models/review_display.dart';
import '../../repositories/reviews_repository.dart';

enum ReviewsLoadStatus { loading, success, error }

/// Owns the async load of [ReviewsPage]'s data against the real
/// [ReviewsRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildReviews()` now that every repository method
/// is a `Future` — a real network call needs a real
/// Loading/Success/Error state, not a fixed `state` toggle.
class ReviewsViewModel extends ChangeNotifier {
  ReviewsViewModel(this._repository);

  final ReviewsRepository _repository;

  ReviewsLoadStatus _status = ReviewsLoadStatus.loading;
  List<ReviewDisplay> _reviews = const [];
  String? _errorMessage;

  ReviewsLoadStatus get status => _status;
  List<ReviewDisplay> get reviews => _reviews;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ReviewsLoadStatus.loading;
    notifyListeners();
    try {
      final reviews = await _repository.getReviews();
      _reviews = await Future.wait(reviews.map(_buildDisplay));
      _status = ReviewsLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ReviewsLoadStatus.error;
    }
    notifyListeners();
  }

  Future<ReviewDisplay> _buildDisplay(Review review) async {
    final provider = await _repository.getProviderFor(review);
    final profile = await _repository.getProfileFor(review);
    final order = await _repository.getOrderFor(review);
    final service = await _repository.getServiceFor(review);
    return ReviewDisplay(
      review: review,
      provider: provider,
      profile: profile,
      order: order,
      service: service,
      reviewerName: mockReviewerNames[review.id] ?? 'Usuario',
      isOwnReview: mockReviewIsOwn[review.id] ?? false,
      canEdit: mockReviewCanEdit[review.id] ?? false,
    );
  }

  Future<void> retry() => load();
}
