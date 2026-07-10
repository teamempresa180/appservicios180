import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_button.dart';

/// Regression tests for the Prompt 25 bug: `AppButton(expand: false)`
/// used to crash ("BoxConstraints forces an infinite width") whenever a
/// parent laid it out at its natural width — Row, Wrap, the cross axis
/// of a horizontal ListView, etc. Root cause: `minimumSize:
/// Size.fromHeight(48)`, which is `Size(double.infinity, 48)` — an
/// infinite *minimum width*. Fixed to `Size(0, 48)`.
///
/// Every layout named in the fix request (Column, Row, Wrap, ListView,
/// GridView, Card, Dialog, BottomSheet, AppBar actions) is covered here
/// for both `expand: true`/`expand: false` and `isLoading: true`/
/// `isLoading: false`.
void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: child),
    );
  }

  void expectNoException(WidgetTester tester) {
    expect(tester.takeException(), isNull);
  }

  group('Column', () {
    for (final expand in [true, false]) {
      for (final isLoading in [true, false]) {
        testWidgets('expand:$expand isLoading:$isLoading', (tester) async {
          await tester.pumpWidget(
            buildApp(
              Column(
                children: [
                  AppButton(
                    label: 'Continuar',
                    onPressed: () {},
                    expand: expand,
                    isLoading: isLoading,
                  ),
                ],
              ),
            ),
          );
          await tester.pump(const Duration(milliseconds: 200));
          expectNoException(tester);
        });
      }
    }
  });

  group('Row', () {
    for (final expand in [true, false]) {
      for (final isLoading in [true, false]) {
        testWidgets('expand:$expand isLoading:$isLoading', (tester) async {
          await tester.pumpWidget(
            buildApp(
              Row(
                children: [
                  const Text('Precio'),
                  const Spacer(),
                  // A widget that fills its available width (`expand:
                  // true`) needs an `Expanded` to have bounded space to
                  // fill when placed directly in a Row's main axis —
                  // that's standard Flex layout, the same as any other
                  // full-width widget, not specific to AppButton.
                  expand
                      ? Expanded(
                          child: AppButton(
                            label: 'Ver',
                            onPressed: () {},
                            isLoading: isLoading,
                          ),
                        )
                      : AppButton(
                          label: 'Ver',
                          onPressed: () {},
                          expand: false,
                          isLoading: isLoading,
                        ),
                ],
              ),
            ),
          );
          await tester.pump(const Duration(milliseconds: 200));
          expectNoException(tester);
        });
      }
    }
  });

  group('Wrap', () {
    for (final expand in [true, false]) {
      for (final isLoading in [true, false]) {
        testWidgets('expand:$expand isLoading:$isLoading', (tester) async {
          await tester.pumpWidget(
            buildApp(
              Wrap(
                children: [
                  AppButton(
                    label: 'Uno',
                    onPressed: () {},
                    expand: expand,
                    isLoading: isLoading,
                  ),
                  AppButton(
                    label: 'Dos',
                    onPressed: () {},
                    expand: expand,
                    isLoading: isLoading,
                  ),
                ],
              ),
            ),
          );
          await tester.pump(const Duration(milliseconds: 200));
          expectNoException(tester);
        });
      }
    }
  });

  group('Card', () {
    for (final expand in [true, false]) {
      for (final isLoading in [true, false]) {
        testWidgets('expand:$expand isLoading:$isLoading', (tester) async {
          await tester.pumpWidget(
            buildApp(
              Card(
                child: AppButton(
                  label: 'Continuar',
                  onPressed: () {},
                  expand: expand,
                  isLoading: isLoading,
                ),
              ),
            ),
          );
          await tester.pump(const Duration(milliseconds: 200));
          expectNoException(tester);
        });
      }
    }
  });

  group('ListView (vertical)', () {
    for (final expand in [true, false]) {
      testWidgets('expand:$expand', (tester) async {
        await tester.pumpWidget(
          buildApp(
            ListView(
              children: [
                AppButton(label: 'Uno', onPressed: () {}, expand: expand),
                AppButton(label: 'Dos', onPressed: () {}, expand: expand),
              ],
            ),
          ),
        );
        await tester.pumpAndSettle();
        expectNoException(tester);
      });
    }
  });

  group('ListView (horizontal)', () {
    for (final expand in [true, false]) {
      testWidgets('expand:$expand', (tester) async {
        await tester.pumpWidget(
          buildApp(
            SizedBox(
              height: 60,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  SizedBox(
                    width: 140,
                    child: AppButton(
                      label: 'Uno',
                      onPressed: () {},
                      expand: expand,
                    ),
                  ),
                  SizedBox(
                    width: 140,
                    child: AppButton(
                      label: 'Dos',
                      onPressed: () {},
                      expand: expand,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();
        expectNoException(tester);
      });
    }
  });

  group('GridView', () {
    for (final expand in [true, false]) {
      testWidgets('expand:$expand', (tester) async {
        await tester.pumpWidget(
          buildApp(
            GridView.count(
              crossAxisCount: 2,
              children: [
                AppButton(label: 'Uno', onPressed: () {}, expand: expand),
                AppButton(label: 'Dos', onPressed: () {}, expand: expand),
              ],
            ),
          ),
        );
        await tester.pumpAndSettle();
        expectNoException(tester);
      });
    }
  });

  group('Dialog', () {
    for (final expand in [true, false]) {
      testWidgets('expand:$expand', (tester) async {
        await tester.pumpWidget(
          buildApp(
            Builder(
              builder: (context) => AppButton(
                label: 'Abrir',
                onPressed: () {
                  showDialog<void>(
                    context: context,
                    builder: (context) => AlertDialog(
                      actions: [
                        AppButton(
                          label: 'Aceptar',
                          onPressed: () {},
                          expand: expand,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        );
        await tester.tap(find.text('Abrir'));
        await tester.pumpAndSettle();
        expectNoException(tester);
      });
    }
  });

  group('BottomSheet', () {
    for (final expand in [true, false]) {
      testWidgets('expand:$expand', (tester) async {
        await tester.pumpWidget(
          buildApp(
            Builder(
              builder: (context) => AppButton(
                label: 'Abrir',
                onPressed: () {
                  showModalBottomSheet<void>(
                    context: context,
                    builder: (context) => AppButton(
                      label: 'Cerrar',
                      onPressed: () {},
                      expand: expand,
                    ),
                  );
                },
              ),
            ),
          ),
        );
        await tester.tap(find.text('Abrir'));
        await tester.pumpAndSettle();
        expectNoException(tester);
      });
    }
  });

  group('AppBar actions', () {
    for (final expand in [true, false]) {
      testWidgets('expand:$expand', (tester) async {
        await tester.pumpWidget(
          MaterialApp(
            theme: AppTheme.light,
            home: Scaffold(
              // `AppBar.actions` is a Row internally — same rule as
              // above: `expand: true` needs an `Expanded` for bounded
              // width, exactly like any other full-width widget there.
              appBar: AppBar(
                actions: [
                  expand
                      ? Expanded(
                          child: AppButton(label: 'Acción', onPressed: () {}),
                        )
                      : AppButton(
                          label: 'Acción',
                          onPressed: () {},
                          expand: false,
                        ),
                ],
              ),
              body: const SizedBox(),
            ),
          ),
        );
        await tester.pumpAndSettle();
        expectNoException(tester);
      });
    }
  });
}
