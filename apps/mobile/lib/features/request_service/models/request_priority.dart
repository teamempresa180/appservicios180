/// Priority level for a service request. **Fully simulated** — no domain
/// module models urgency/priority for a Service/Order today. Lives only in
/// presentation, never added to any domain entity. See the feature README.
enum RequestPriority {
  low,
  normal,
  high;

  String get label {
    switch (this) {
      case RequestPriority.low:
        return 'Baja';
      case RequestPriority.normal:
        return 'Normal';
      case RequestPriority.high:
        return 'Alta';
    }
  }
}
