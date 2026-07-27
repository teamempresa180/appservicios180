import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/session/user_role.dart';
import '../../../../core/session/user_role_controller.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../widgets/client_home_content.dart';
import '../widgets/home_header.dart';
import '../widgets/provider_home_content.dart';

/// Single, role-adaptive Home screen. Lives inside the App Shell's body
/// (the "Inicio" destination) — it does NOT build its own `Scaffold`,
/// it only returns content for the area the Shell already provides.
///
/// The role comes from [UserRoleController] (switched from the App
/// Shell's side drawer) — there is no per-account role on the backend
/// yet, so this stays a local, device-side switch. See the feature
/// README for how this will eventually connect to real data.
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: locator<UserRoleController>(),
      builder: (context, _) {
        final role = locator<UserRoleController>().role;

        // Cliente Home is a full-bleed map + floating panel (see
        // `ClientHomeContent`) — it needs the bounded, non-scrolling
        // space `AppShellPage`'s Scaffold body already provides, so it
        // bypasses `AppPageBody`'s scrolling header+body wrapper (and
        // `HomeHeader`, which `ClientHomeContent` replaces with its own
        // floating greeting pill). Proveedor Home is unaffected.
        return switch (role) {
          UserRole.client => const ClientHomeContent(),
          UserRole.provider => const AppPageBody(
            header: HomeHeader(role: UserRole.provider),
            body: ProviderHomeContent(),
          ),
        };
      },
    );
  }
}
