import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:scabld_safe_area_insets/scabld_safe_area_insets.dart';

import 'router/app_router.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  setupViewportFit();
  runApp(const ProviderScope(child: ChatboxEditorApp()));
}

class ChatboxEditorApp extends StatelessWidget {
  const ChatboxEditorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      builder: (context, child) {
        return WebSafeAreaInsets(child: child ?? const SizedBox());
      },
      title: 'Chatbox Editor',
      theme: AppTheme.darkTheme,
      routerConfig: appRouter,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en'),
      ],
      debugShowCheckedModeBanner: false,
    );
  }
}