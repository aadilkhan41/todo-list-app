export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        fontFamily: { sans: ["Poppins", "system-ui", "sans-serif"] },
        colors: {
          bg: "var(--bg)", ink: "var(--ink)", mute: "var(--mute)", line: "var(--line)",
          field: "var(--field)", sheet: "var(--sheet)", tint: "var(--tint)",
          redtint: "var(--redtint)", track: "var(--track)", navy: "var(--navy)",
          brand: "#4764E8", danger: "#E5484D",
        },
      },
    },
};
  