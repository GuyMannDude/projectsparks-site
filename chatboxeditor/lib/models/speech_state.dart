import 'package:freezed_annotation/freezed_annotation.dart';

part 'speech_state.freezed.dart';

@freezed
class SpeechState with _$SpeechState {
  const factory SpeechState({
    @Default('') String transcript,
    @Default('') String buffer,
    @Default(false) bool isListening,
    @Default(false) bool isSupported,
    @Default(false) bool hasPermission,
    String? error,
  }) = _SpeechState;
}