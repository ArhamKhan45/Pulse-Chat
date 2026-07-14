/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: "#14B8A6",
          light: "#2DD4BF",
          dark: "#0D9488",
          soft: "#99F6E4",
        },

        // Background hierarchy
        background: "#000000",

        surface: {
          DEFAULT: "#0B0B0B", // Main surfaces
          light: "#171717", // Elevated
          dark: "#000000", // App background
          card: "#121212", // Cards
          sidebar: "#050505", // Sidebar / Bottom tabs
        },

        // Text
        foreground: "#FAFAFA",
        "muted-foreground": "#A1A1AA",
        "subtle-foreground": "#71717A",

        // Borders
        border: "#27272A",
        "border-hover": "#3F3F46",
        divider: "#1F1F23",

        // Feedback
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",

        // Chat
        bubble: {
          sent: "#14B8A6",
          received: "#171717",

          "sent-foreground": "#FFFFFF",
          "received-foreground": "#FAFAFA",
        },

        // Status
        online: "#22C55E",
        away: "#F59E0B",
        offline: "#71717A",

        overlay: "rgba(0,0,0,0.65)",
      },

      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        full: "9999px",
      },
    },
  },

  plugins: [],
};
