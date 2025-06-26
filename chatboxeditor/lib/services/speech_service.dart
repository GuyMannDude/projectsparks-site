import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class SpeechService {
  static const platform = MethodChannel('speech_recognition');
  
  // Callbacks
  Function(String)? onResult;
  Function(String)? onPartialResult;
  Function(String)? onError;
  Function()? onStartListening;
  Function()? onStopListening;

  bool _isListening = false;
  bool get isListening => _isListening;

  Future<bool> initialize() async {
    if (kIsWeb) {
      // On web, we'll use a simplified approach
      return true;
    }
    
    try {
      final bool available = await platform.invokeMethod('hasPermission');
      return available;
    } catch (e) {
      return false;
    }
  }

  Future<bool> requestPermission() async {
    if (kIsWeb) {
      return true;
    }
    
    try {
      final bool granted = await platform.invokeMethod('requestPermission');
      return granted;
    } catch (e) {
      return false;
    }
  }

  Future<void> startListening() async {
    if (_isListening) return;

    try {
      _isListening = true;
      onStartListening?.call();
      
      if (kIsWeb) {
        // For web, we'll simulate speech recognition
        _simulateSpeechRecognition();
      } else {
        await platform.invokeMethod('startListening');
      }
    } catch (e) {
      _isListening = false;
      onError?.call('Failed to start listening: $e');
    }
  }

  Future<void> stopListening() async {
    if (!_isListening) return;

    try {
      _isListening = false;
      onStopListening?.call();
      
      if (!kIsWeb) {
        await platform.invokeMethod('stopListening');
      }
    } catch (e) {
      onError?.call('Failed to stop listening: $e');
    }
  }

  void _simulateSpeechRecognition() {
    // Simulate interim results
    Future.delayed(const Duration(milliseconds: 500), () {
      if (_isListening) {
        onPartialResult?.call('Hello...');
      }
    });
    
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (_isListening) {
        onPartialResult?.call('Hello world...');
      }
    });
    
    Future.delayed(const Duration(milliseconds: 3000), () {
      if (_isListening) {
        onResult?.call('Hello world, this is a test transcription.');
        _isListening = false;
        onStopListening?.call();
      }
    });
  }

  void dispose() {
    _isListening = false;
  }
}