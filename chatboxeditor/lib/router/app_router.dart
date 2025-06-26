import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../screens/transcribe/screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const TranscribeScreen(),
    ),
  ],
);