import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1800px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["Inter", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
        micro: ["Inter", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        "hero": ["4.5rem", { lineHeight: "1.1", fontWeight: "800" }],
        "hero-md": ["3.5rem", { lineHeight: "1.1", fontWeight: "800" }],
        "hero-sm": ["2.5rem", { lineHeight: "1.1", fontWeight: "800" }],
        "section": ["3rem", { lineHeight: "1.15", fontWeight: "700" }],
        "section-sm": ["2rem", { lineHeight: "1.2", fontWeight: "700" }],
        "h3": ["1.75rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "small": ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        "large-title": ["1.9375rem", { lineHeight: "2.375rem", fontWeight: "400" }],
        "title-1": ["1.5625rem", { lineHeight: "1.9375rem", fontWeight: "400" }],
        "title-2": ["1.1875rem", { lineHeight: "1.5rem", fontWeight: "400" }],
        "title-3": ["1.0625rem", { lineHeight: "1.375rem", fontWeight: "400" }],
        "headline": ["0.875rem", { lineHeight: "1.1875rem", fontWeight: "600" }],
        "body-spec": ["0.875rem", { lineHeight: "1.1875rem", fontWeight: "400" }],
        "callout": ["0.8125rem", { lineHeight: "1.125rem", fontWeight: "400" }],
        "subhead": ["0.75rem", { lineHeight: "1rem", fontWeight: "400" }],
        "footnote": ["0.75rem", { lineHeight: "1rem", fontWeight: "400" }],
        "caption-1": ["0.6875rem", { lineHeight: "0.8125rem", fontWeight: "400" }],
        "caption-2": ["0.6875rem", { lineHeight: "0.8125rem", fontWeight: "400" }],
      },
      spacing: {
        "xs": "0.5rem",
        "sm-space": "1rem",
        "md-space": "2rem",
        "lg-space": "4rem",
        "xl-space": "7.5rem",
      },
      colors: {
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
        "hero-bg": "hsl(var(--hero-bg))",
        "hero-foreground": "hsl(var(--hero-foreground))",
        "surface-dark": "hsl(var(--surface-dark))",
        "surface-dark-foreground": "hsl(var(--surface-dark-foreground))",
        "neon-green": "hsl(var(--neon-green))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.4,0,0.2,1) forwards",
        "fade-in": "fade-in 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
