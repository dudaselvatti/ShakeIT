export const lightTheme = {
  colors: {
    primary: "#E63946",
    accent: "#FFCA3A",
    background: "#F4F6F8",
    surface: "#FFFFFF",

    text: "#1A1D1E",
    textLight: "#6C757D",
    border: "#DEE2E6",

    danger: "#C1121F",
    success: "#2A9D8F",
    warning: "#F77F00",
  },
  metrics: {
    borderRadius: 12,
    padding: 16,
  },
};

export const darkTheme = {
  colors: {
    primary: "#E63946",
    accent: "#FFCA3A",
    background: "#121212",
    surface: "#1E1E1E",

    text: "#F4F6F8",
    textLight: "#A0AAB2",
    border: "#333333",

    danger: "#CF6679",
    success: "#03DAC6",
    warning: "#FFB74D",
  },
  metrics: lightTheme.metrics,
};

export type ThemeType = typeof lightTheme;
export const theme = lightTheme;
