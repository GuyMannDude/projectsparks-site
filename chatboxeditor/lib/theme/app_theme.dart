import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryNeon = Color(0xFF00FF88);
  static const Color secondaryNeon = Color(0xFF00D4FF);
  static const Color accentNeon = Color(0xFFFF0080);
  static const Color warningNeon = Color(0xFFFFBF00);
  static const Color purpleNeon = Color(0xFF8B5CF6);
  
  static const Color darkBg = Color(0xFF0A0A0F);
  static const Color cardBg = Color(0xFF1A1A2E);
  static const Color surfaceBg = Color(0xFF16213E);
  
  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: darkBg,
    textTheme: GoogleFonts.orbitronTextTheme().apply(
      bodyColor: Colors.white,
      displayColor: Colors.white,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 8,
        shadowColor: primaryNeon.withOpacity(0.3),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: cardBg,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: primaryNeon.withOpacity(0.3)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: primaryNeon, width: 2),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: secondaryNeon.withOpacity(0.2)),
      ),
    ),
    colorScheme: ColorScheme.dark(
      primary: primaryNeon,
      secondary: secondaryNeon,
      tertiary: purpleNeon,
      surface: cardBg,
      background: darkBg,
      error: accentNeon,
    ),
  );

  static BoxDecoration get gradientBackground => const BoxDecoration(
    gradient: RadialGradient(
      center: Alignment.topLeft,
      radius: 1.5,
      colors: [
        Color(0xFF1A1A2E),
        Color(0xFF16213E),
        Color(0xFF0A0A0F),
      ],
    ),
  );

  static BoxDecoration neonGlow(Color color, [double blur = 20]) => BoxDecoration(
    borderRadius: BorderRadius.circular(30),
    boxShadow: [
      BoxShadow(
        color: color.withOpacity(0.3),
        blurRadius: blur,
        spreadRadius: 2,
      ),
      BoxShadow(
        color: color.withOpacity(0.1),
        blurRadius: blur * 2,
        spreadRadius: 4,
      ),
    ],
  );

  static BoxDecoration textFieldGlow() => BoxDecoration(
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: secondaryNeon.withOpacity(0.1),
        blurRadius: 15,
        spreadRadius: 1,
      ),
    ],
  );
}