import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/trust/entities/trust.dart';
import 'package:mobile/trust/models/trust_id.dart';
import 'package:mobile/trust/models/trust_score.dart';
import 'package:mobile/trust/models/trust_level.dart';
import 'package:mobile/trust/models/trust_status.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = TrustId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final trust = Trust(
      id: id,
      identityId: identityId,
      score: const TrustScore.of(92),
      level: TrustLevel.veryHigh,
      status: TrustStatus.active,
      createdAt: now,
      updatedAt: now,
    );

    expect(trust.id, id);
    expect(trust.identityId, identityId);
    expect(trust.score.value, 92);
    expect(trust.level, TrustLevel.veryHigh);
  });
}
