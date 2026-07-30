import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

/// Base class for a [ChangeNotifier] view model that owns one or more
/// in-flight repository calls.
///
/// Every repository method already accepts an optional `CancelToken?`
/// (see `ApiClient`), but before this class nothing in the app ever
/// created one — a view model that got disposed (user navigated away,
/// widget torn down) left its request running, and when the response
/// eventually landed it called `notifyListeners()` on an already-disposed
/// `ChangeNotifier`, crashing with "A ChangeNotifier was used after being
/// disposed". On the two real phones this pilot runs on, this is not a
/// rare edge case — flaky mobile data means slow responses are the norm,
/// and users navigate away from a loading screen constantly.
///
/// ### How to adopt this in a view model
///
/// 1. Extend [CancellableViewModel] instead of [ChangeNotifier].
/// 2. Pass [cancelToken] to every repository call the view model makes:
///
/// ```dart
/// class MyViewModel extends CancellableViewModel {
///   MyViewModel(this._repository);
///   final MyRepository _repository;
///
///   Future<void> load() async {
///     _status = LoadStatus.loading;
///     notifySafely();
///     try {
///       final data = await _repository.getData(cancelToken: cancelToken);
///       _status = LoadStatus.success;
///     } on HttpException catch (e) {
///       if (e is CancelledHttpException) return; // superseded, not an error
///       _status = LoadStatus.error;
///     }
///     notifySafely();
///   }
/// }
/// ```
///
/// 3. Replace every `notifyListeners()` call with [notifySafely] — it is
///    a no-op after [dispose], so a response that lands just after the
///    widget was torn down never throws.
/// 4. Don't override [dispose] to cancel manually — the base class
///    already cancels [cancelToken] there. If a subclass does need its
///    own `dispose()` cleanup, call `super.dispose()` last (cancelling
///    the token first still lets any `catchError`/`on HttpException`
///    around the pending call run before teardown finishes).
///
/// A repository call that gets cancelled resolves to a
/// `CancelledHttpException` (see `error_mapper.dart`) rather than
/// hanging or throwing something unexpected — callers that care can
/// special-case it (typically by just returning early, since the view
/// model is being torn down anyway), but they don't have to: by the time
/// it arrives, [notifySafely] already silently drops the resulting
/// `notifyListeners()`.
abstract class CancellableViewModel extends ChangeNotifier {
  final CancelToken _cancelToken = CancelToken();
  bool _disposed = false;

  /// Pass this to every repository/`ApiClient` call this view model
  /// makes. Cancelled automatically in [dispose].
  @protected
  CancelToken get cancelToken => _cancelToken;

  /// Whether [dispose] has already run — a request that resolves after
  /// that point must not touch any state a disposed widget tree can no
  /// longer observe.
  @protected
  bool get isDisposed => _disposed;

  /// Same as `notifyListeners()`, except it is a safe no-op once this
  /// view model has been disposed. Use this instead of
  /// `notifyListeners()` everywhere in a [CancellableViewModel] subclass.
  @protected
  void notifySafely() {
    if (_disposed) return;
    notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    if (!_cancelToken.isCancelled) {
      _cancelToken.cancel('$runtimeType disposed');
    }
    super.dispose();
  }
}
