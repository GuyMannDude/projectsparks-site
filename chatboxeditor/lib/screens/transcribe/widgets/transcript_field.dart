import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter/material.dart';

import '../../../theme/app_theme.dart';

class TranscriptField extends StatelessWidget {
  final String value;
  final ValueChanged<String> onChanged;
  final bool isListening;

  const TranscriptField({
    super.key,
    required this.value,
    required this.onChanged,
    this.isListening = false,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return Container(
      decoration: AppTheme.textFieldGlow(),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isListening 
                ? AppTheme.primaryNeon.withOpacity(0.6)
                : AppTheme.secondaryNeon.withOpacity(0.3),
            width: isListening ? 2 : 1,
          ),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppTheme.cardBg.withOpacity(0.8),
              AppTheme.surfaceBg.withOpacity(0.6),
            ],
          ),
        ),
        child: TextField(
          controller: TextEditingController(text: value)
            ..selection = TextSelection.fromPosition(
              TextPosition(offset: value.length),
            ),
          onChanged: onChanged,
          maxLines: null,
          expands: true,
          textAlignVertical: TextAlignVertical.top,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            fontSize: 18,
            height: 1.6,
            color: Colors.white,
            shadows: [
              Shadow(
                color: AppTheme.secondaryNeon.withOpacity(0.3),
                blurRadius: 5,
              ),
            ],
          ),
          decoration: InputDecoration(
            hintText: l10n.transcriptPlaceholder,
            hintStyle: TextStyle(
              color: Colors.grey.withOpacity(0.6),
              fontSize: 16,
            ),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.all(24),
          ),
        ),
      ),
    )
        .animate(target: isListening ? 1 : 0)
        .shimmer(
          duration: 2000.ms,
          color: AppTheme.primaryNeon.withOpacity(0.1),
        );
  }
}