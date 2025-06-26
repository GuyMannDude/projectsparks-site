// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'speech_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$SpeechState {
  String get transcript => throw _privateConstructorUsedError;
  String get buffer => throw _privateConstructorUsedError;
  bool get isListening => throw _privateConstructorUsedError;
  bool get isSupported => throw _privateConstructorUsedError;
  bool get hasPermission => throw _privateConstructorUsedError;
  String? get error => throw _privateConstructorUsedError;

  /// Create a copy of SpeechState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SpeechStateCopyWith<SpeechState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SpeechStateCopyWith<$Res> {
  factory $SpeechStateCopyWith(
          SpeechState value, $Res Function(SpeechState) then) =
      _$SpeechStateCopyWithImpl<$Res, SpeechState>;
  @useResult
  $Res call(
      {String transcript,
      String buffer,
      bool isListening,
      bool isSupported,
      bool hasPermission,
      String? error});
}

/// @nodoc
class _$SpeechStateCopyWithImpl<$Res, $Val extends SpeechState>
    implements $SpeechStateCopyWith<$Res> {
  _$SpeechStateCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of SpeechState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transcript = null,
    Object? buffer = null,
    Object? isListening = null,
    Object? isSupported = null,
    Object? hasPermission = null,
    Object? error = freezed,
  }) {
    return _then(_value.copyWith(
      transcript: null == transcript
          ? _value.transcript
          : transcript // ignore: cast_nullable_to_non_nullable
              as String,
      buffer: null == buffer
          ? _value.buffer
          : buffer // ignore: cast_nullable_to_non_nullable
              as String,
      isListening: null == isListening
          ? _value.isListening
          : isListening // ignore: cast_nullable_to_non_nullable
              as bool,
      isSupported: null == isSupported
          ? _value.isSupported
          : isSupported // ignore: cast_nullable_to_non_nullable
              as bool,
      hasPermission: null == hasPermission
          ? _value.hasPermission
          : hasPermission // ignore: cast_nullable_to_non_nullable
              as bool,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$SpeechStateImplCopyWith<$Res>
    implements $SpeechStateCopyWith<$Res> {
  factory _$$SpeechStateImplCopyWith(
          _$SpeechStateImpl value, $Res Function(_$SpeechStateImpl) then) =
      __$$SpeechStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String transcript,
      String buffer,
      bool isListening,
      bool isSupported,
      bool hasPermission,
      String? error});
}

/// @nodoc
class __$$SpeechStateImplCopyWithImpl<$Res>
    extends _$SpeechStateCopyWithImpl<$Res, _$SpeechStateImpl>
    implements _$$SpeechStateImplCopyWith<$Res> {
  __$$SpeechStateImplCopyWithImpl(
      _$SpeechStateImpl _value, $Res Function(_$SpeechStateImpl) _then)
      : super(_value, _then);

  /// Create a copy of SpeechState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transcript = null,
    Object? buffer = null,
    Object? isListening = null,
    Object? isSupported = null,
    Object? hasPermission = null,
    Object? error = freezed,
  }) {
    return _then(_$SpeechStateImpl(
      transcript: null == transcript
          ? _value.transcript
          : transcript // ignore: cast_nullable_to_non_nullable
              as String,
      buffer: null == buffer
          ? _value.buffer
          : buffer // ignore: cast_nullable_to_non_nullable
              as String,
      isListening: null == isListening
          ? _value.isListening
          : isListening // ignore: cast_nullable_to_non_nullable
              as bool,
      isSupported: null == isSupported
          ? _value.isSupported
          : isSupported // ignore: cast_nullable_to_non_nullable
              as bool,
      hasPermission: null == hasPermission
          ? _value.hasPermission
          : hasPermission // ignore: cast_nullable_to_non_nullable
              as bool,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc

class _$SpeechStateImpl implements _SpeechState {
  const _$SpeechStateImpl(
      {this.transcript = '',
      this.buffer = '',
      this.isListening = false,
      this.isSupported = false,
      this.hasPermission = false,
      this.error});

  @override
  @JsonKey()
  final String transcript;
  @override
  @JsonKey()
  final String buffer;
  @override
  @JsonKey()
  final bool isListening;
  @override
  @JsonKey()
  final bool isSupported;
  @override
  @JsonKey()
  final bool hasPermission;
  @override
  final String? error;

  @override
  String toString() {
    return 'SpeechState(transcript: $transcript, buffer: $buffer, isListening: $isListening, isSupported: $isSupported, hasPermission: $hasPermission, error: $error)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SpeechStateImpl &&
            (identical(other.transcript, transcript) ||
                other.transcript == transcript) &&
            (identical(other.buffer, buffer) || other.buffer == buffer) &&
            (identical(other.isListening, isListening) ||
                other.isListening == isListening) &&
            (identical(other.isSupported, isSupported) ||
                other.isSupported == isSupported) &&
            (identical(other.hasPermission, hasPermission) ||
                other.hasPermission == hasPermission) &&
            (identical(other.error, error) || other.error == error));
  }

  @override
  int get hashCode => Object.hash(runtimeType, transcript, buffer, isListening,
      isSupported, hasPermission, error);

  /// Create a copy of SpeechState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SpeechStateImplCopyWith<_$SpeechStateImpl> get copyWith =>
      __$$SpeechStateImplCopyWithImpl<_$SpeechStateImpl>(this, _$identity);
}

abstract class _SpeechState implements SpeechState {
  const factory _SpeechState(
      {final String transcript,
      final String buffer,
      final bool isListening,
      final bool isSupported,
      final bool hasPermission,
      final String? error}) = _$SpeechStateImpl;

  @override
  String get transcript;
  @override
  String get buffer;
  @override
  bool get isListening;
  @override
  bool get isSupported;
  @override
  bool get hasPermission;
  @override
  String? get error;

  /// Create a copy of SpeechState
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SpeechStateImplCopyWith<_$SpeechStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
