import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';

import '../../theme/app_theme.dart';
import 'controller.dart';
import 'widgets/neon_button.dart';
import 'widgets/status_indicator.dart';
import 'widgets/transcript_field.dart';

class TranscribeScreen extends ConsumerWidget {
  const TranscribeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final state = ref.watch(transcribeControllerProvider);
    final controller = ref.read(transcribeControllerProvider.notifier);
    
    return Scaffold(
      body: Container(
        decoration: AppTheme.gradientBackground,
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final isMobile = constraints.maxWidth < 600;
              final isTablet = constraints.maxWidth >= 600 && constraints.maxWidth < 1024;
              
              return Padding(
                padding: EdgeInsets.all(isMobile ? 16 : 24),
                child: Column(
                  children: [
                    // Header
                    _buildHeader(context, l10n, isMobile),
                    Gap(isMobile ? 20 : 32),
                    
                    // Status indicator
                    StatusIndicator(
                      isListening: state.isListening,
                      error: state.error,
                    ),
                    Gap(isMobile ? 16 : 24),
                    
                    // Transcript field
                    Expanded(
                      child: TranscriptField(
                        value: state.transcript,
                        onChanged: controller.updateTranscript,
                        isListening: state.isListening,
                      ),
                    ),
                    Gap(isMobile ? 24 : 32),
                    
                    // Control buttons
                    _buildControlButtons(
                      context, 
                      controller, 
                      state, 
                      l10n, 
                      isMobile,
                    ),
                    Gap(isMobile ? 16 : 24),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, AppLocalizations l10n, bool isMobile) {
    return Text(
      l10n.appTitle,
      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
        fontSize: isMobile ? 24 : 32,
        fontWeight: FontWeight.bold,
        foreground: Paint()
          ..shader = const LinearGradient(
            colors: [AppTheme.primaryNeon, AppTheme.secondaryNeon],
          ).createShader(const Rect.fromLTWH(0.0, 0.0, 200.0, 70.0)),
        shadows: [
          Shadow(
            color: AppTheme.primaryNeon.withOpacity(0.3),
            blurRadius: 10,
          ),
        ],
      ),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildControlButtons(
    BuildContext context,
    TranscribeController controller,
    dynamic state,
    AppLocalizations l10n,
    bool isMobile,
  ) {
    final buttonWidth = isMobile ? 140.0 : 160.0;
    final buttonHeight = isMobile ? 50.0 : 60.0;
    
    return Column(
      children: [
        // Start/Pause buttons row
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            NeonButton(
              text: state.isListening ? l10n.pauseButton : l10n.startButton,
              onPressed: state.isSupported ? controller.toggleListening : null,
              color: state.isListening ? AppTheme.warningNeon : AppTheme.primaryNeon,
              width: buttonWidth,
              height: buttonHeight,
              isActive: state.isListening,
            ),
          ],
        ),
        Gap(isMobile ? 16 : 20),
        
        // Send button
        NeonButton(
          text: l10n.sendButton,
          onPressed: state.transcript.isNotEmpty ? controller.sendToChat : null,
          color: AppTheme.purpleNeon,
          width: isMobile ? 280 : 320,
          height: buttonHeight,
        ),
      ],
    );
  }
}