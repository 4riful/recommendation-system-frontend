export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dracula-bg": "#282a36",
        "dracula-foreground": "#f8f8f2",
        "dracula-pink": "#ff79c6",
        "dracula-green": "#50fa7b",
        "dracula-purple": "#bd93f9",
        "dracula-cyan": "#8be9fd",
        "dracula-yellow": "#f1fa8c",
        "dracula-orange": "#ffb86c",
        "dracula-comment": "#6272a4",
        // Optionally, add any extra colors that you reference (like dracula-red)
        "dracula-red": "#ff5555",
      },
      fontFamily: {
        sans: ['JetBrains Mono', 'monospace'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dracula: {
          "primary": "#bd93f9", // Bright purple
          "dracula-bg": "#282a36",
          "dracula-foreground": "#f8f8f2",
          "dracula-pink": "#ff79c6",
          "dracula-green": "#50fa7b",
          "dracula-purple": "#bd93f9",
          "dracula-cyan": "#8be9fd",
          "dracula-yellow": "#f1fa8c",
          "dracula-orange": "#ffb86c",
          "dracula-comment": "#6272a4",  
          "secondary": "#ff79c6", // Pinkish red
          "accent": "#8be9fd", // Light cyan
          "neutral": "#282a36", // Darker gray
          "base-100": "#1e1f29", // Very dark background
          "info": "#6272a4", // Light gray-blue
          "success": "#50fa7b", // Bright green
          "warning": "#ffb86c", // Orange
          "error": "#ff5555", // Bright red
          
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    defaultTheme: "dracula", // Set Dracula as the default theme
  },
};
