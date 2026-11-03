const path = require("path")

/**
 * Design foundations
 * - Colours: brand palette + semantic tokens (ink / muted / line / surface)
 * - Type: Apple-style ramp — size, leading and tracking set together
 * - Motion: strong ease-out curves, short durations (UI stays under 300ms)
 * - hover: only applies on devices that can hover (no sticky hover on phones)
 */
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)"
const EASE_DRAWER = "cubic-bezier(0.32, 0.72, 0, 1)"

module.exports = {
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
      },
      transitionTimingFunction: {
        DEFAULT: EASE_OUT,
        out: EASE_OUT,
        "in-out": EASE_IN_OUT,
        drawer: EASE_DRAWER,
      },
      transitionDuration: {
        DEFAULT: "200ms",
        press: "160ms",
      },
      colors: {
        // Brand colors matching the logo
        brand: {
          black: "#111111",        // Navbar background
          peach: "#D9A676",        // Rose gold - decorative accents (not for small text)
          sandstone: "#C8B9A6",    // Secondary surfaces
          cream: "#FAF7F3",        // Page background
          linen: "#F4E9DD",        // Raised cream surfaces, chips
          brown: "#5A4636",        // Deep brown - headings
          accent: {
            DEFAULT: "#D4682D",    // Brand orange — icons, large accents
            strong: "#B4552A",     // Primary buttons & accent text (AA: 4.9:1 with white, 4.6:1 on cream)
          },
          terracotta: "#A65A3A",   // Pressed / hover of primary action
        },
        // Semantic tokens — prefer these in new UI
        ink: {
          DEFAULT: "#1C1917",      // Primary text
          muted: "#57534E",        // Secondary text (AA on cream)
          subtle: "#78716C",       // Tertiary text, captions
        },
        line: {
          DEFAULT: "rgba(28, 25, 23, 0.10)",  // Hairlines / dividers
          strong: "rgba(28, 25, 23, 0.18)",   // Input borders
        },
        surface: {
          DEFAULT: "#FAF7F3",      // = brand.cream
          raised: "#FFFFFF",       // Cards, sheets
          sunken: "#F4E9DD",       // = brand.linen
        },
        grey: {
          0: "#FFFFFF",
          5: "#F9FAFB",
          10: "#F3F4F6",
          20: "#E5E7EB",
          30: "#D1D5DB",
          40: "#9CA3AF",
          50: "#6B7280",
          60: "#4B5563",
          70: "#374151",
          80: "#1F2937",
          90: "#111827",
        },
      },
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        card: "20px",            // Cards, sheets, image frames
        control: "12px",         // Inputs, steppers, small buttons
        circle: "9999px",
      },
      boxShadow: {
        // Soft, semi-transparent shadows instead of hard borders
        card: "0 1px 2px rgba(28, 25, 23, 0.04), 0 4px 16px rgba(28, 25, 23, 0.06)",
        float: "0 2px 6px rgba(28, 25, 23, 0.06), 0 16px 48px rgba(28, 25, 23, 0.14)",
        hairline: "0 0 0 1px rgba(28, 25, 23, 0.10)",
      },
      spacing: {
        "safe-b": "env(safe-area-inset-bottom)",
        "safe-t": "env(safe-area-inset-top)",
      },
      maxWidth: {
        "8xl": "100rem",
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontSize: {
        "3xl": "2rem",
        // Type ramp — leading tightens and tracking goes negative as size grows
        display: ["clamp(2.25rem, 1.6rem + 3vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "700" }],
        "title-1": ["clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "title-2": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
        "title-3": ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "500" }],
        headline: ["1.0625rem", { lineHeight: "1.35", letterSpacing: "-0.005em", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.5", letterSpacing: "0" }],
        callout: ["0.9375rem", { lineHeight: "1.45", letterSpacing: "0" }],
        footnote: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.005em" }],
        caption: ["0.75rem", { lineHeight: "1.35", letterSpacing: "0.01em" }],
      },
      fontFamily: {
        satoshi: ["var(--font-satoshi)", "sans-serif"],
        sans: [
          "var(--font-satoshi)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Ubuntu",
          "sans-serif",
        ],
      },
      keyframes: {
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-top": {
          "0%": {
            height: "100%",
          },
          "99%": {
            height: "0",
          },
          "100%": {
            visibility: "hidden",
          },
        },
        "accordion-slide-up": {
          "0%": {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          "100%": {
            height: "0",
            opacity: "0",
          },
        },
        "accordion-slide-down": {
          "0%": {
            "min-height": "0",
            "max-height": "0",
            opacity: "0",
          },
          "100%": {
            "min-height": "var(--radix-accordion-content-height)",
            "max-height": "none",
            opacity: "1",
          },
        },
        enter: {
          "0%": { transform: "scale(0.96)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.96)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "fade-in-right": `fade-in-right 250ms ${EASE_OUT} forwards`,
        "fade-in-top": `fade-in-top 200ms ${EASE_OUT} forwards`,
        "fade-out-top": `fade-out-top 200ms ${EASE_OUT} forwards`,
        "accordion-open": `accordion-slide-down 250ms ${EASE_OUT} forwards`,
        "accordion-close": `accordion-slide-up 200ms ${EASE_OUT} forwards`,
        enter: `enter 200ms ${EASE_OUT}`,
        "slide-in": `slide-in 400ms ${EASE_DRAWER}`,
        leave: `leave 150ms ${EASE_OUT} forwards`,
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
}
