import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/entities/address.dart';
import 'package:mobile/contact/entities/contact.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:mobile/features/profile/presentation/widgets/profile_address.dart';
import 'package:mobile/features/profile/presentation/widgets/profile_contact.dart';
import 'package:mobile/features/profile/presentation/widgets/profile_information.dart';
import 'package:mobile/features/profile/presentation/widgets/profile_statistics.dart';
import 'package:mobile/features/profile/repositories/mock_profile_repository.dart';
import 'package:mobile/features/profile/repositories/profile_repository.dart';
import 'package:mobile/identity/entities/identity.dart';
import 'package:mobile/profiles/entities/profile.dart';

/// Wraps [MockProfileRepository] (already `Future`-returning) so tests
/// can force it to never resolve (loading state) or throw (error
/// state), without touching the real mock data.
class _FakeProfileRepository implements ProfileRepository {
  _FakeProfileRepository({this.neverResolves = false, this.throwsError = false});

  final bool neverResolves;
  final bool throwsError;
  final _delegate = MockProfileRepository();

  @override
  Future<Profile> getProfile() {
    if (neverResolves) return Completer<Profile>().future;
    if (throwsError) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.getProfile();
  }

  @override
  Future<Identity> getIdentity() => _delegate.getIdentity();

  @override
  Future<List<Contact>> getContacts() => _delegate.getContacts();

  @override
  Future<Address> getAddress() => _delegate.getAddress();
}

void main() {
  Widget buildApp({ProfileRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: ProfilePage(repository: repository ?? _FakeProfileRepository())),
    );
  }

  testWidgets('shows the header with the display name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Perfil'), findsOneWidget);
    expect(find.text('Camila Torres'), findsWidgets);
  });

  testWidgets('shows the identity information with member-since', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProfileInformation), findsOneWidget);
    expect(find.textContaining('Miembro desde'), findsOneWidget);
  });

  testWidgets('shows every real contact channel', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProfileContact), findsOneWidget);
    expect(find.text('camila.torres@example.com'), findsOneWidget);
    expect(find.text('+57 300 123 4567'), findsOneWidget);
  });

  testWidgets('shows the real address', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProfileAddress), findsOneWidget);
    expect(find.text('Casa'), findsOneWidget);
  });

  testWidgets('shows the simulated completion percentage and checklist', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProfileStatistics), findsOneWidget);
    expect(find.text('75%'), findsOneWidget);
    expect(find.text('Agrega una foto de perfil'), findsOneWidget);
  });

  testWidgets('shows both profile actions', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Editar perfil'), findsOneWidget);
    expect(find.text('Cerrar sesión'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeProfileRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ProfileInformation), findsNothing);
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeProfileRepository(throwsError: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.text('Reintentar'), findsOneWidget);
    expect(find.byType(ProfileInformation), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
