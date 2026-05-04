import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Page background
    bg: '#eef1f8',

    // Navy palette
    navy: '#21356A',
    navyMid: '#2d4a8a',
    navyLight: '#4a6aaa',
    navyPale: '#b8c8e8',

    // Cards + borders
    cardBg: '#f8faff',
    cardHover: '#ffffff',
    border: '#d4dcec',
    borderSoft: '#e4eaf4',

    // Text
    muted: '#6a85b0',
    mutedSoft: '#8ea3c7',

    // Service category accents
    accentGold: '#d4a64a',
    accentGoldDark: '#8a6a28',
    accentTeal: '#5a9a9a',
    accentPurple: '#7a5bc4',
    accentPurplePale: '#ebe1ff',
    accentTerracotta: '#c47a5a',
    accentPink: '#f4b6c8',
    accentPinkDark: '#b85a7a',

    // Other accents
    accentGreen: '#4a8a6a',
    accentGreenBright: '#22a858',
    accentRed: '#e04545',

    // Utility
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },

  fonts: {
    serif: 'CormorantGaramond_500Medium',
    serifItalic: 'CormorantGaramond_500Medium_Italic',
    sans: 'InstrumentSans_400Regular',
    sansMedium: 'InstrumentSans_500Medium',
    sansSemiBold: 'InstrumentSans_600SemiBold',
    sansBold: 'InstrumentSans_700Bold',
  },

  fontSize: {
    displayXL: 30,
    displayL: 26,
    displayM: 20,
    displayS: 18,
    displayXS: 16,
    pageTitle: 26,
    bodyL: 14,
    bodyM: 13,
    bodyS: 12,
    label: 11,
    labelSm: 10,
  },

  fontWeight: {
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  spacing: {
    page: 20,        // horizontal page padding
    cardPadding: 16,
    sectionGap: 24,
    cardGap: 12,
    rowGap: 14,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  radius: {
    card: 16,
    cardSm: 12,
    button: 12,
    buttonSm: 10,
    pill: 999,
    chip: 20,
    avatar: 999,
  },

  // Each shadow token has both iOS and Android forms
  shadows: {
    sm: Platform.select({
      ios: {
        shadowColor: '#21356A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
      default: {},
    }),
    md: Platform.select({
      ios: {
        shadowColor: '#21356A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 4 },
      default: {},
    }),
    lg: Platform.select({
      ios: {
        shadowColor: '#21356A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 32,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },

  // Top safe area: 46px (Dynamic Island + status bar)
  // Bottom safe area: 18px (home indicator)
  // These are handled by react-native-safe-area-context at runtime;
  // hardcoded here only for reference, not for use in styles.
  safeArea: {
    top: 46,
    bottom: 18,
  },
} as const;

export type Theme = typeof theme;
