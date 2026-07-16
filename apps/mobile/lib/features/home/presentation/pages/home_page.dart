import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../mock/mock_user_role.dart';
import '../models/user_role.dart';
import '../widgets/client_home_content.dart';
import '../widgets/home_header.dart';
import '../widgets/provider_home_content.dart';

/// Single, role-adaptive Home screen. Lives inside the App Shell's body
/// (the "Inicio" destination) — it does NOT build its own `Scaffold`,
/// it only returns content for the area the Shell already provides.
///
/// The role is simulated locally via [MockUserRole] — there is no
/// authentication yet, so it cannot come from a real session. See the
/// feature README for how this will eventually connect to real data.
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    const role = MockUserRole.current;

    // Cliente Home is a full-bleed map + floating panel (see
    // `ClientHomeContent`) — it needs the bounded, non-scrolling space
    // `AppShellPage`'s Scaffold body already provides, so it bypasses
    // `AppPageBody`'s scrolling header+body wrapper (and `HomeHeader`,
    // which `ClientHomeContent` replaces with its own floating greeting
    // pill). Proveedor Home is unaffected.
    return switch (role) {
      UserRole.client => const ClientHomeContent(),
      UserRole.provider => const AppPageBody(
        header: HomeHeader(role: role),
        body: ProviderHomeContent(),
      ),
    };
  }
}
