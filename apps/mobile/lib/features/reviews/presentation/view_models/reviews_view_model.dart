import '../../../../core/network/http_exceptions.dart';
import '../../../../core/presentation/cancellable_view_model.dart';
import '../../../../order/entities/order.dart';
import '../../../../profiles/entities/profile.dart';
import '../../../../provider/entities/provider.dart';
import '../../../../review/entities/review.dart';
import '../../../../service/entities/service.dart';
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
class ReviewsViewModel extends CancellableViewModel {
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
    notifySafely();
    try {
      final reviews = await _repository.getReviews(cancelToken: cancelToken);
      _reviews = await Future.wait(reviews.map(_buildDisplay));
      _status = ReviewsLoadStatus.success;
    } on HttpException catch (exception) {
      if (exception is CancelledHttpException) return;
      _errorMessage = exception.message;
      _status = ReviewsLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = ReviewsLoadStatus.error;
    }
    notifySafely();
  }

  Future<ReviewDisplay> _buildDisplay(Review review) async {
    // The four lookups are independent — none reads another's result —
    // so they go out together. Awaited one-by-one this cost four
    // serial round-trips *per review*, i.e. 40 for a 10-review list.
    final results = await Future.wait([
      _repository.getProviderFor(review, cancelToken: cancelToken),
      _repository.getProfileFor(review, cancelToken: cancelToken),
      _repository.getOrderFor(review, cancelToken: cancelToken),
      _repository.getServiceFor(review, cancelToken: cancelToken),
    ]);
    final provider = results[0] as Provider;
    final profile = results[1] as Profile;
    final order = results[2] as Order;
    final service = results[3] as Service;
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
