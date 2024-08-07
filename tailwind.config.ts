import type { Config } from "tailwindcss"
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: {
        input: `0px 2px 3px -1px hsla(0, 0%, 0%, 0.1), 0px 1px 0px 0px hsla(218, 14%, 11%, 0.02), 0px 0px 0px 1px hsla(218, 14%, 11%, 0.08)`,
      },
      colors: {
        lightPrimary: "hsl(222, 83%, 98%)",
        blueSecondary: "hsl(251, 100%, 55%)",
        brandLinear: "hsl(237, 100%, 76%)",
        navy: {
          50: "hsl(223, 84%, 90%)",
          100: "hsl(224, 98%, 83%)",
          200: "hsl(224, 86%, 81%)",
          300: "hsl(226, 74%, 68%)",
          400: "hsl(227, 55%, 47%)",
          500: "hsl(228, 75%, 42%)",
          600: "hsl(228, 59%, 34%)",
          700: "hsl(228, 47%, 20%)",
          800: "hsl(227, 60%, 17%)",
          900: "hsl(228, 67%, 13%)",
        },
        brand: {
          50: "hsl(253, 100%, 95%)",
          100: "hsl(247, 97%, 86%)",
          200: "hsl(247, 96%, 79%)",
          300: "hsl(247, 96%, 72%)",
          400: "hsl(252, 100%, 66%)",
          500: "hsl(247, 96%, 57%)",
          600: "hsl(250, 86%, 46%)",
          700: "hsl(246, 81%, 36%)",
          800: "hsl(248, 91%, 30%)",
          900: "hsl(247, 94%, 25%)",
        },
        shadow: {
          500: "hsla(210, 29%, 56%, 0.08)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        "2.5xl": "1.25rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'diagonal': "url('/diagonal-lines.svg')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        text: "text 5s infinite ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
} satisfies Config

export default config

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}