/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          primary: "#123B63",      // Deep Navy
          primaryDark: "#0D2A47",  // Darker Navy for header/nav
          secondary: "#1F5A85",    // Secondary Blue
          lightBlue: "#EAF2F8",    // Light Blue tint for table heads/alerts
          saffron: "#E67E22",      // Saffron accent
          green: "#2E7D32",        // Green accent / Verified
          bg: "#F7F8FA",           // Base public portal background
          card: "#FFFFFF",         // White card surface
          text: "#202B33",         // Primary dark charcoal body text
          muted: "#5F6B73",        // Secondary muted gray text
          border: "#D7DDE2",       // Clean light gray border
          borderDark: "#A8B4BE",   // Slightly darker border for active/focused states
          danger: "#C62828",       // High risk / Error red
          warning: "#D35400",      // Medium risk / Warning orange
          success: "#2E7D32",      // Low risk / Pass green
        }
      },
      fontFamily: {
        sans: ['Noto Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'Latha', 'Mukta Malar', 'sans-serif'],
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'sm': '2px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '8px',
      }
    },
  },
  plugins: [],
}
