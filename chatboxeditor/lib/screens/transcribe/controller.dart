import 'package:flutter/services.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../models/speech_state.dart';
import '../../services/speech_service.dart';

part 'controller.g.dart';

@riverpod
class TranscribeController extends _$TranscribeController {
  late SpeechService _speechService;

  @override
  SpeechState build() {
    _speechService = SpeechService();
    _setupSpeechCallbacks();
    
    // Initialize speech service after build
    Future.microtask(() => _initializeSpeech());
    
    return const SpeechState();
  }

  void _setupSpeechCallbacks() {
    _speechService.onResult = (text) {
      state = state.copyWith(
        transcript: state.transcript + text + ' ',
        buffer: state.buffer + text + ' ',
      );
    };

    _speechService.onPartialResult = (text) {
      // Show partial results in real-time
      final baseTranscript = state.buffer;
      state = state.copyWith(
        transcript: baseTranscript + text,
      );
    };

    _speechService.onError = (error) {
      state = state.copyWith(error: error, isListening: false);
    };

    _speechService.onStartListening = () {
      state = state.copyWith(isListening: true, error: null);
    };

    _speechService.onStopListening = () {
      state = state.copyWith(isListening: false);
    };
  }

  Future<void> _initializeSpeech() async {
    final isSupported = await _speechService.initialize();
    final hasPermission = await _speechService.requestPermission();
    
    state = state.copyWith(
      isSupported: isSupported,
      hasPermission: hasPermission,
    );
  }

  Future<void> toggleListening() async {
    if (state.isListening) {
      await _speechService.stopListening();
    } else {
      if (!state.hasPermission) {
        final granted = await _speechService.requestPermission();
        if (!granted) {
          state = state.copyWith(error: 'Microphone permission denied');
          return;
        }
        state = state.copyWith(hasPermission: true);
      }
      
      await _speechService.startListening();
    }
  }

  void updateTranscript(String text) {
    state = state.copyWith(transcript: text);
  }

  Future<void> sendToChat() async {
    if (state.transcript.isEmpty) return;
    
    try {
      // Copy to clipboard
      await Clipboard.setData(ClipboardData(text: state.transcript));
      
      // Clear the transcript and buffer
      state = state.copyWith(
        transcript: '',
        buffer: '',
      );
      
      // Show success feedback (you could add a success state to the model)
    } catch (e) {
      state = state.copyWith(error: 'Failed to copy to clipboard: $e');
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  @override
  void dispose() {
    _speechService.dispose();
  }
}