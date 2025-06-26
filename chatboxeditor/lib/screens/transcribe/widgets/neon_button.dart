import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter/material.dart';

import '../../../theme/app_theme.dart';

class NeonButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final Color color;
  final Color? glowColor;
  final double? width;
  final double? height;
  final bool isActive;

  const NeonButton({
    super.key,
    required this.text,
    required this.onPressed,
    required this.color,
    this.glowColor,
    this.width,
    this.height,
    this.isActive = false,
  });

  @override
  State<NeonButton> createState() => _NeonButtonState();
}

class _NeonButtonState extends State<NeonButton> {
  bool _isHovered = false;
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final glowColor = widget.glowColor ?? widget.color;
    final isInteractive = widget.onPressed != null;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTapDown: (_) => setState(() => _isPressed = true),
        onTapUp: (_) => setState(() => _isPressed = false),
        onTapCancel: () => setState(() => _isPressed = false),
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          width: widget.width,
          height: widget.height ?? 60,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(30),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                widget.color.withOpacity(_isPressed ? 0.9 : 0.8),
                widget.color.withOpacity(_isPressed ? 0.7 : 0.6),
              ],
            ),
            border: Border.all(
              color: widget.color.withOpacity(0.6),
              width: 1,
            ),
            boxShadow: [
              if (_isHovered || widget.isActive) ...[
                BoxShadow(
                  color: glowColor.withOpacity(0.4),
                  blurRadius: 20,
                  spreadRadius: 2,
                ),
                BoxShadow(
                  color: glowColor.withOpacity(0.2),
                  blurRadius: 40,
                  spreadRadius: 4,
                ),
              ] else ...[
                BoxShadow(
                  color: glowColor.withOpacity(0.1),
                  blurRadius: 10,
                  spreadRadius: 1,
                ),
              ],
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: Container(
              alignment: Alignment.center,
              child: Text(
                widget.text,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(
                      color: widget.color.withOpacity(0.5),
                      blurRadius: 8,
                    ),
                  ],
                ),
              ),
            ),
          ),
        )
            .animate(target: _isPressed ? 1 : 0)
            .scale(begin: const Offset(1, 1), end: const Offset(0.95, 0.95), duration: 100.ms)
            .animate(target: widget.isActive ? 1 : 0)
            .shimmer(duration: 2000.ms, color: glowColor.withOpacity(0.3))
            .animate(target: _isHovered && isInteractive ? 1 : 0)
            .scale(begin: const Offset(1, 1), end: const Offset(1.05, 1.05), duration: 200.ms),
      ),
    );
  }
}