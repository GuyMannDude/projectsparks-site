import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../../../theme/app_theme.dart';

class StatusIndicator extends StatelessWidget {
  final bool isListening;
  final String? error;

  const StatusIndicator({
    super.key,
    required this.isListening,
    this.error,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    if (error != null) {
      return _buildErrorStatus(context, error!);
    }
    
    if (isListening) {
      return _buildListeningStatus(context, l10n.listening);
    }
    
    return _buildPausedStatus(context, l10n.paused);
  }

  Widget _buildListeningStatus(BuildContext context, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          PhosphorIconsFill.microphone,
          color: AppTheme.primaryNeon,
          size: 20,
        )
            .animate(onPlay: (controller) => controller.repeat())
            .scale(
              begin: const Offset(1.0, 1.0),
              end: const Offset(1.2, 1.2),
              duration: 1000.ms,
            )
            .then(delay: 100.ms)
            .scale(
              begin: const Offset(1.2, 1.2),
              end: const Offset(1.0, 1.0),
              duration: 1000.ms,
            ),
        const SizedBox(width: 8),
        Text(
          text,
          style: TextStyle(
            color: AppTheme.primaryNeon,
            fontWeight: FontWeight.w600,
            shadows: [
              Shadow(
                color: AppTheme.primaryNeon.withOpacity(0.3),
                blurRadius: 5,
              ),
            ],
          ),
        )
            .animate(onPlay: (controller) => controller.repeat())
            .fadeIn(duration: 500.ms)
            .then(delay: 500.ms)
            .fadeOut(duration: 500.ms),
      ],
    );
  }

  Widget _buildPausedStatus(BuildContext context, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          PhosphorIconsRegular.pause,
          color: AppTheme.warningNeon,
          size: 20,
        ),
        const SizedBox(width: 8),
        Text(
          text,
          style: TextStyle(
            color: AppTheme.warningNeon,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildErrorStatus(BuildContext context, String error) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          PhosphorIconsRegular.warning,
          color: AppTheme.accentNeon,
          size: 20,
        ),
        const SizedBox(width: 8),
        Flexible(
          child: Text(
            error,
            style: TextStyle(
              color: AppTheme.accentNeon,
              fontWeight: FontWeight.w500,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}